import * as PIXI from 'pixi.js-legacy'
import EventEmitter from 'events'
import TextureService from './texture'

class Star extends EventEmitter {

  constructor (app, location, fullStar, coloursValues, shapes) {
    super()

    this.location = location
    this.infrastructure = {
      economy: 0,
      industry: 0,
      science: 0,
    }
    this.warpGate = false
    this.homeStar = false
    this.playerIndex = -1
    this.specialistId = -1

    this.naturalResources = Math.round(Math.random()*50)

    if(fullStar) {
      this.location = fullStar.location
      this.infrastructure = fullStar.infrastructure
      this.warpGate = fullStar.warpGate
      this.homeStar = fullStar.homeStar
      this.playerIndex = fullStar.playerIndex
      this.specialistId = fullStar.specialistId
      this.naturalResources = fullStar.naturalResources
    }

    this.app = app
    this.container = new PIXI.Container()
    this.container.position.x = location.x
    this.container.position.y = location.y
    this.container.interactive = true
    //this.container.interactiveChildren = false
    this.container.buttonMode = true
    this.container.hitArea = new PIXI.Circle(0, 0, 32)
    this.baseScale = 1.0/4.0

    this.container.on('pointerup', this.onClicked.bind(this))
    this.container.on('mouseover', this.onMouseOver.bind(this))
    this.container.on('mouseout', this.onMouseOut.bind(this))

    this.player = {}
    this._updatePlayer(coloursValues, shapes)

    this._updateGraphics()
  }

  _updatePlayer(colours, shapes) {
    if(this.playerIndex === -1) { return }
    this.player.colour = colours[this.playerIndex%8]
    this.player.shape = shapes[Math.floor(this.playerIndex/8)]
  }

  _updateGraphics() {
    if( this.homeStar ) {
      this.container.scale.x = 2.0*this.baseScale
      this.container.scale.y = 2.0*this.baseScale
    }
    else {
      this.container.scale.x = 1.0*this.baseScale
      this.container.scale.y = 1.0*this.baseScale
    }
    this._updateStarGeometry()
    this._updateWarpGateGeometry()
    this._updatePlayerGeometry()
    this._updateInfrastructureText()
    this._updateNaturalResourcesText()
    this._updateSpecialistSprite()
  }

  _updatePlayerGeometry() {
    if( this.playerGeometry ) {
      this.container.removeChild(this.playerGeometry)
    }
    if( this.playerIndex === -1 ) { return }

    this.playerGeometry = new PIXI.Graphics()
    this.playerGeometry.lineStyle(1.0, this.player.colour, 1.0)

    switch (this.player.shape) {
      case 'circle':
        this._drawCircleGeometry()
        break
      case 'square':
        this._drawSquareGeometry()
        break
      case 'diamond':
        this._drawDiamondGeometry()
        break
      case 'hexagon':
        this._drawHexagonGeometry()
        break
    }

    this.playerGeometry.scale.x = 3.0
    this.playerGeometry.scale.y = 3.0
    this.container.addChild(this.playerGeometry)
  }

  _drawCircleGeometry() {
    this.playerGeometry.drawCircle(0,0,8)
  }
  _drawSquareGeometry() {
    this.playerGeometry.drawRect(-8,-8,16,16)
  }
  _drawDiamondGeometry() {
    let s = 9;

    this.playerGeometry.moveTo(0, -s)
    this.playerGeometry.lineTo(-s, 0)
    this.playerGeometry.lineTo(0, s)
    this.playerGeometry.lineTo(s, 0)
    this.playerGeometry.closePath()
  }
  _drawHexagonGeometry() {
    this.playerGeometry.moveTo(4, -7)
    this.playerGeometry.lineTo(-4, -7)
    this.playerGeometry.lineTo(-8, 0)
    this.playerGeometry.lineTo(-4, 7)
    this.playerGeometry.lineTo(4, 7)
    this.playerGeometry.lineTo(8, 0)
    this.playerGeometry.closePath()
  }

  _updateSpecialistSprite() {
    //TODO swap sprite texture instead
    if( this.specialist_sprite ) {
      this.container.removeChild(this.specialist_sprite)
      this.specialist_sprite.destroy()
      this.specialist_sprite = null
    }
    if(this.specialistId === -1) { return }

    let specialistTexture = TextureService.getSpecialistTexture(this.specialistId, false)
    this.specialist_sprite = new PIXI.Sprite(specialistTexture)
    this.specialist_sprite.width = 32
    this.specialist_sprite.height = 32
    this.specialist_sprite.position.x = -16
    this.specialist_sprite.position.y = -16
    this.container.addChild(this.specialist_sprite)
  }

  _updateWarpGateGeometry() {
    //TODO use graphics.clear
    if( this.warpGate_geometry ) {
      this.container.removeChild(this.warpGate_geometry)
    }
    if( this.warpGate ) {
      this.warpGate_geometry = new PIXI.Graphics()
      this.warpGate_geometry.lineStyle(2, 0xffffff, 1.0)
      this.warpGate_geometry.drawCircle(0, 0, 32)
      this.container.addChild(this.warpGate_geometry)
    }
  }

  _updateStarGeometry() {
    if( this.star_geometry ) {
      this.container.removeChild(this.star_geometry)
    }
    if( this.specialistId !== -1 ) { return }

    this.star_geometry = new PIXI.Graphics()
    this.star_geometry.lineStyle(2, 0xffffff, 1.0)
    this.star_geometry.drawCircle(0, 0, 8)
    this.container.addChild(this.star_geometry)
  }

  _updateNaturalResourcesText() {
    //TODO use bitmap text, change text without creating another object
    if( this.naturalResources_text ) {
      this.container.removeChild(this.naturalResources_text)
    }
    this.naturalResources_text = new PIXI.Text(`${this.naturalResources}`, {fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, align: 'center'})
    this.naturalResources_text.position.x = -(this.naturalResources_text.width/2.0)
    this.naturalResources_text.position.y = 16
    this.container.addChild(this.naturalResources_text)
  }

  _updateInfrastructureText() {
    //TODO use bitmap text, ignore if 0, change text without creating another object
    if( this.infrastructure_text ) {
      this.container.removeChild(this.infrastructure_text)
    }
    this.infrastructure_text = new PIXI.Text(`${this.infrastructure.economy} ${this.infrastructure.industry} ${this.infrastructure.science}`, {fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, align: 'center'})
    this.infrastructure_text.position.x = (-this.infrastructure_text.width/2.0)
    this.infrastructure_text.position.y = -16-(this.infrastructure_text.height)
    this.container.addChild(this.infrastructure_text)
  }

  onClicked (e) {
    this.emit('onStarClicked', {
      star: this,
      e,
    })
  }

  update(colours, shapes) {
    this._updatePlayer(colours,shapes)
    this._updateGraphics()
  }

  onMouseOver (e) {
		e = null
		if (e) {console.log()}
    this.emit('onStarMouseOver', this)
  }

  onMouseOut (e) {
		e = null
		if (e) {console.log()}
    this.emit('onStarMouseOut', this)
  }

  destroy () {
    this.container.destroy()
  }

  toJSON() {
    return( {
      location: this.location,
      naturalResources: this.naturalResources,
      infrastructure: this.infrastructure,
      warpGate: this.warpGate,
      homeStar: this.homeStar,
      playerIndex: this.playerIndex,
      specialistId: this.specialistId
    })
  }

}

export default Star