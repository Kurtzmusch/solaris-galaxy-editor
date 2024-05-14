import * as PIXI from 'pixi.js-legacy'
import { Viewport } from 'pixi-viewport'
import Star from './Star'
import TextureService from './texture'
import EventEmitter from 'events'
var vec2 = require('vec2')

class GalaxyEditor extends EventEmitter {

  static COLOURS = require('./colours.json') //TODO pull this from the api
  static SPECIALISTS = require('./specialists.json')
  static LIGHT_YEAR_LENGTH = 50

  constructor() {
    super()
    this.cursor = { x: 0, y: 0 }
    this.stars = new Array()
    this.selectedStar = null
    this.lastSelectedStar = null
    //this.vueContainer = null

    //TODO move this into brush component
    this.brushOptions = {
      brushRadius: 2,
      starAmount: 3
    }
    this.specialists = GalaxyEditor.SPECIALISTS
    this.playerShapeAndColours = []
    this.coloursValues = []
    this.shapes = ['circle', 'square', 'diamond', 'hexagon'] //TODO pull this from api, this is hardcoded in the server's player service and not defined in any specific file
    for( let shape of this.shapes ) {
      for( let colour of GalaxyEditor.COLOURS ) {
        let alias = colour.alias
        this.coloursValues.push(colour.value)
        this.playerShapeAndColours.push(alias+' '+shape)
      }
    }

    TextureService.initialize()

    this.frames = 0
    this.dtAccum = 33.0*16
    this.lowest = 1000
    this.previousDTs = [ 33.0, 33.0, 33.0, 33.0, 33.0, 33.0, 33.0, 33.0, 33.0, 33.0, 33.0,     33.0, 33.0, 33.0, 33.0, 33.0 ]
    this.ma32accum = 0

  }

  calcFPS() {
    let elapsed = this.app.ticker.elapsedMS
    this.frames+=1
    this.previousDTs.pop()
    this.previousDTs.unshift(elapsed)

    this.dtAccum = this.previousDTs.reduce( (total, current) => { return total+current } )
    this.ma32accum += elapsed

    let movingAverageDT = this.dtAccum/16.0
    let movingAverageFPS = 1000.0/movingAverageDT
    let ma32DT = this.ma32accum/32.0

    let fps = 1000.0/elapsed
    if( fps < this.lowest ) { this.lowest = fps }
    if (this.fpsNowText) {
      this.fpsNowText.text = ( 'fps: ' + fps.toFixed(0) )
    }

    if(this.frames==31) {
      let ma32FPS = 1000.0/ma32DT
      
      if (this.fpsMAText) {
        this.fpsMAText.text =  ( 'fpsMA: ' + movingAverageFPS.toFixed(0) )
      }
      
      if (this.fpsMA32Text) {
        this.fpsMA32Text.text = ( 'fpsMA32: ' + ma32FPS.toFixed(0) )
      }
      
      if (this.jitterText) {
        this.jitterText.text = ( 'jitter: ' + (movingAverageFPS-this.lowest).toFixed(0) )
      }

      if (this.lowestText) {
        this.lowestText.text = ( 'lowest: '+ this.lowest.toFixed(0) )
      }

      this.frames = 0
      this.lowest = 1000
      this.ma32accum = 0
    }
  }

  createPixiApp () {

    // Cleanup if the app already exists.
    this.destroy()

    //let antialiasing = userSettings.map.antiAliasing === 'enabled';

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000, // black hexadecimal
      resolution: window.devicePixelRatio || 1,
      antialias: 'disabled',
      autoResize: true
    })

    // create viewport
    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,

      // yolo
      worldWidth: Number.MAX_VALUE,
      worldHeight: Number.MAX_VALUE,

      divWheel: this.app.renderer.view, // Ensures that when using the scroll wheel it only takes affect when the mouse is over the canvas (prevents scrolling in overlaying divs from scrolling the canvas)
      stopPropagation: true,
      passiveWheel: true,

      interaction: this.app.renderer.plugins.interaction, // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
      disableOnContextMenu: true
    })
    this.setupViewport()
    this.viewport.setZoom(2)
    this._drawPivotStarVisualizer()
    this._drawScaleBar()
    this._drawTotalStars()

    // add the viewport to the stage
    this.app.stage.addChild(this.viewport)

    this.app.ticker.add(this._onTick.bind(this))
    if ( process.env.NODE_ENV == 'development') {
      this.app.ticker.add(this.calcFPS.bind(this))
      this.draw()
    }

  }

  destroy () {
    // Cleanup if the app already exists.
    if (this.app) {
      this.app.destroy(false, {
        children: true
      })

      this.app = null
    }

    if (this.viewport) {
      this.viewport.destroy()
      this.viewport = null
    }
  }

  zoomIn () {
    this.viewport.zoomPercent(0.5, true)
  }

  zoomOut () {
    this.viewport.zoomPercent(-0.3, true)
  }

  setupViewport () {
    // activate plugins
    this.viewport
      .drag()
      .pinch()
      .wheel({
        // percent: 2,
        smooth: 5
      })
      .decelerate({ friction: 0.9 })
      .clamp({
        left: this.starFieldLeft,
        right: this.starFieldRight,
        top: this.starFieldTop,
        bottom: this.starFieldBottom
      })
      .clampZoom({
        minWidth: 50,
        minHeight: 50,
        maxWidth: Math.abs(this.starFieldLeft) + Math.abs(this.starFieldRight),
        maxHeight: Math.abs(this.starFieldBottom) + Math.abs(this.starFieldTop)
      })

    this.viewport.on('clicked', this._onViewportClicked.bind(this))
  }

  _onViewportClicked(clickEvent) {
    let button = clickEvent.event.data.originalEvent.button
    console.log(button)
    if( this.hoveredStar ) {
      if(button === 0) {
        this.selectedStar = this.hoveredStar
        this.lastSelectedStar = this.selectedStar
        this._updatePivotStarVisualizer()
        this.emit( 'onStarSelected' )
        //TODO implement this on the brush
      }
      if(button === 2) {
        this.destroyHovered()
      }
    }
    else {
      this.selectedStar = null
      if(button === 0) {
        this.addStars(this.cursor)
      }
      if(button === 2) {
        //TODO implement this on the brush
        this.destroyStars(this.cursor)
      }
      this.emit( 'onNothingClicked', this.cursor, button )
    }
  }

  copyStar( star, newLocation ) {
    let newStar = this.addStar( newLocation, null )
    newStar.warpGate = star.warpGate
    newStar.homeStar = star.homeStar
    newStar.playerId = star.playerId ?? -1
    newStar.specialistId = star.specialistId ?? -1
    newStar.wormHoleToStarId = star.wormHoleToStarId ?? -1

    newStar.infrastructure.economy = star.infrastructure.economy
    newStar.infrastructure.industry = star.infrastructure.industry
    newStar.infrastructure.science = star.infrastructure.science

    newStar.naturalResources.economy = star.naturalResources.economy
    newStar.naturalResources.industry = star.naturalResources.industry
    newStar.naturalResources.science = star.naturalResources.science

    newStar.isAsteroidField = star.isAsteroidField
    newStar.isBlackHole = star.isBlackHole
    newStar.isBinaryStar = star.isBinaryStar
    newStar.isNebula = star.isNebula
    newStar.isPulsar = star.isPulsar
    newStar._updateGraphics()

  }

  addStar( location, fullStar ) {
    let star = new Star(this.app, location, fullStar, this.coloursValues, this.shapes)
    star.on('onStarMouseOver', this.onStarMouseOver.bind(this))
    star.on('onStarMouseOut', this.onStarMouseOut.bind(this))
    this.stars.push(star)
    this.viewport.addChild(star.container)
    return star
  }

  addStars( location ) {
    //TODO implement this on the brush
    let amount = this.brushOptions.starAmount
    let radius = this.brushOptions.brushRadius*50
    if(amount === 1) {
      this.addStar(location)
      return
    }
    for( let i = 0; i < amount; i++ ) {
      let randomLocation = {
        x: (location.x - radius) + (Math.random()*radius*2.0),
        y: (location.y - radius) + (Math.random()*radius*2.0)
      }
      let star = new Star(this.app, randomLocation)
      star.on('onStarMouseOver', this.onStarMouseOver.bind(this))
      star.on('onStarMouseOut', this.onStarMouseOut.bind(this))
      this.stars.push(star)
      this.viewport.addChild(star.container)
    }
  }

  clear() {
    this.selectedStar = null
    for(let star of this.stars) {
      this.viewport.removeChild(star.container)
    }
    this.stars = new Array()
  }

  generateJSON() {
    return JSON.stringify({
      homeStars: this.homeStars,
      stars: this.stars
    }, null, 2)
  }

  loadFromJSON( json ) {
    this.clear()
    let rawStructure = JSON.parse(json)
    let rawStars = rawStructure.stars
    try {
      for(let star of rawStars) {
        if( typeof star.location.x !== 'number' ) return
        if( typeof star.location.y !== 'number' ) return

        if( typeof star.homeStar !== 'boolean' ) return
        if( typeof star.warpGate !== 'boolean' ) return


        //if( typeof star.naturalResources !== 'number' ) return
      }
      for(let star of rawStars) {
        this.addStar(star.location, star)
      }
    }
    catch(e) {
      console.error(e)
    }
  }

  onMenuChanged() {
    this.selectedStar = null
  }

  onStarMouseOver(star) {
    this.hoveredStar = star
  }

  onStarMouseOut(star) {
		if(star) {console.log()}
    this.hoveredStar = null
  }

  updateSelected() {
    if( this.selectedStar ) {
      this.selectedStar.update(this.coloursValues, this.shapes)
    }
  }

  destroyStars(cursor) {
    //TODO implement this on the brush
    let radius = this.brushOptions.brushRadius*50
    let starsUnderBrush = this.stars.filter( (star) => {
      let starPosition = new vec2(star.location.x, star.location.y)
      let cursorPosition = new vec2(cursor.x, cursor.y)
      return starPosition.distance(cursorPosition) < radius
    } )
    starsUnderBrush.forEach( (star) => {
      const index = this.stars.indexOf(star)
      if( index > -1 ) { this.stars.splice(index, 1) }
      this.viewport.removeChild( star.container )
    } )
  }

  destroySelected() {
    if( this.selectedStar ) {

      //TODO check if this is implemented in any helper class
      const index = this.stars.indexOf(this.selectedStar)
      if( index > -1 ) { this.stars.splice(index, 1) }

      this.viewport.removeChild( this.selectedStar.container )
      this.destroyWormHolesToStar(this.selectedStar.id)
      this.selectedStar = null
    }
  }

  updateWormHoleToStarId(targetId) {
    const beforeId = this.selectedStar.wormHoleToStarId
    if (beforeId !== -1) {
      // remove old inbound wormholes if any
      this.destroyWormHolesToStar(this.selectedStar.id)
    }
    if (targetId !== -1) {
      const otherStar = this.stars.find(s => s.id === targetId)
      // remove old inbound wormholes to target star if any
      this.destroyWormHolesToStar(targetId)
      // create wormhole pair
      otherStar.wormHoleToStarId = this.selectedStar.id
      otherStar._updateGraphics()
    }
    this.selectedStar.wormHoleToStarId = targetId
    this.selectedStar._updateGraphics()
  }

  destroyHovered() {
    const index = this.stars.indexOf(this.hoveredStar)
    if( index > -1 ) { this.stars.splice(index, 1) }

    this.viewport.removeChild( this.hoveredStar.container )
    this.destroyWormHolesToStar(this.hoveredStar.id)
    this.hoveredStar = null
  }

  destroyWormHolesToStar(starId) {
    for( let origin of this.stars ) {
      if (origin.wormHoleToStarId === starId) {
        origin.wormHoleToStarId = -1
        origin._updateGraphics()
      }
    }
  }

  getGalaxyCenter() {
    let totalX = 0
    let totalY = 0
    for( let star of this.stars ) {
      totalX += star.location.x
      totalY += star.location.y
    }
    let center = new vec2(totalX/this.stars.length, totalY/this.stars.length)
    return center
  }

  _onTick() {
    let viewportWidth = (this.viewport.right-this.viewport.left)
    let zoom = (this.viewport.screenWidth / viewportWidth)
    this._updateScaleBarScale(zoom)
    this._updateStarCountString()
  }

  draw () {
      let bitmapFont = { fontName: "Arial", fontSize: 16 }

      this.fpsNowText = new PIXI.BitmapText("", bitmapFont)
      this.fpsMAText = new PIXI.BitmapText("", bitmapFont)
      this.fpsMA32Text = new PIXI.BitmapText("", bitmapFont)
      this.jitterText = new PIXI.BitmapText("", bitmapFont)
      this.lowestText = new PIXI.BitmapText("", bitmapFont)
      this.zoomText = new PIXI.BitmapText("", bitmapFont)
      this.fpsNowText.x = 32
      this.fpsNowText.y = 128+16
      this.fpsMAText.x = 32
      this.fpsMAText.y = this.fpsNowText.y + 32+2
      this.fpsMA32Text.x = 32
      this.fpsMA32Text.y = this.fpsMAText.y +32+2
      this.jitterText.x = 32
      this.jitterText.y = this.fpsMA32Text.y + 32+2
      this.lowestText.x = 32
      this.lowestText.y = this.jitterText.y +32+2
      //this.zoomText.x = 32
      //this.zoomText.y = this.lowestText.y +32+2
      this.app.stage.addChild(this.fpsNowText)
      this.app.stage.addChild(this.jitterText)
      this.app.stage.addChild(this.lowestText)
      this.app.stage.addChild(this.fpsMAText)
      this.app.stage.addChild(this.fpsMA32Text)
      //this.app.stage.addChild(this.zoomText)
  }

  _drawTotalStars() {
    this.totalStarsText = new PIXI.Text('' ,{fontFamily : 'Arial', fontSize: 14, fill : 0xffffff, align : 'center'})
    this.totalStarsText.position.y = this.totalStarsText.height
    this.app.stage.addChild(this.totalStarsText)
  }

  _drawScaleBar() {
    this.scaleText = new PIXI.Text('1 light year: ',{fontFamily : 'Arial', fontSize: 14, fill : 0xffffff, align : 'center'})
    this.app.stage.addChild(this.scaleText)
    this.scaleBar = new PIXI.Graphics()
    this.scaleBar.beginFill(0xffffff, 1.0)
    this.scaleBar.drawRect(0,0,GalaxyEditor.LIGHT_YEAR_LENGTH, this.scaleText.height/4.0)
    this.scaleBar.endFill()
    this.scaleBar.position.x = this.scaleText.width
    this.scaleBar.position.y = this.scaleText.height/2.0 - this.scaleBar.height/2.0
    this.app.stage.addChild(this.scaleBar)
  }

  _drawPivotStarVisualizer() {
    this.pivotStarVisualizer = new PIXI.Graphics()
    this.pivotStarVisualizer.beginFill(0xffffff, 1.0)
    this.pivotStarVisualizer.drawRect(-32, -1, 24, 2)
    this.pivotStarVisualizer.drawRect(8, -1, 24, 2)
    this.pivotStarVisualizer.drawRect(-1, -32-8, 2, 24)
    this.pivotStarVisualizer.drawRect(-1, 8+8, 2, 24)
    this.viewport.addChild( this.pivotStarVisualizer )
  }

  _updateStarCountString() {
    this.totalStarsText.text = 'Amount of stars: ' + String(this.stars.length)
  }

  _updateScaleBarScale(zoom) {
    this.scaleBar.scale.x = zoom
  }

  _updatePivotStarVisualizer() {
    this.pivotStarVisualizer.position.x = this.lastSelectedStar.location.x
    this.pivotStarVisualizer.position.y = this.lastSelectedStar.location.y
  }
}

let editor = new GalaxyEditor()

export default editor
