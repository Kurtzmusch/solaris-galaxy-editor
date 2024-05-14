import * as PIXI from 'pixi.js-legacy'
import EventEmitter from 'events'
import TextureService from './texture'
//import galaxyEditor from './editor'

class Star extends EventEmitter {

  static currentId = 0
  static textAttribs = {fontName: 'Arial'}
  static smallTextAttribs = {fontName: 'Arial', fontSize: 14}

  constructor (app, location, fullStar, coloursValues, shapes) {
    super()

    this.id = Star.currentId
    Star.currentId += 1

    this.location = location
    this.infrastructure = {
      economy: 0,
      industry: 0,
      science: 0,
    }
    this.warpGate = false
    this.homeStar = false
    this.playerId = -1
    this.specialistId = -1
    this.wormHoleToStarId = -1
    this.isAsteroidField = false
    this.isBinaryStar = false
    this.isBlackHole = false
    this.isNebula = false
    this.isPulsar = false

    let nr = Math.round(Math.random()*50)
    this.naturalResources = {
      economy: nr,
      industry: nr,
      science: nr,
    }

    if(fullStar) {
      this.id = fullStar.id
      Star.currentId = fullStar.id+1
      this.location = fullStar.location
      this.warpGate = fullStar.warpGate
      this.homeStar = fullStar.homeStar
      this.playerId = fullStar.playerId ?? -1
      this.specialistId = fullStar.specialistId ?? -1
      this.wormHoleToStarId = fullStar.wormHoleToStarId ?? -1
      this.naturalResources = fullStar.naturalResources
      if( fullStar.infrastructure ) {
        this.infrastructure = fullStar.infrastructure
      }
      this.isAsteroidField = fullStar.isAsteroidField
      this.isBinaryStar = fullStar.isBinaryStar
      this.isBlackHole = fullStar.isBlackHole
      this.isNebula = fullStar.isNebula
      this.isPulsar = fullStar.isPulsar
    }

    this.app = app
    this.container = new PIXI.Container()
    this.container.position.x = location.x
    this.container.position.y = location.y
    this.container.interactive = true
    this.container.interactiveChildren = false
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

  updatePosition() {
    this.container.position.x = this.location.x
    this.container.position.y = this.location.y
  }

  _updatePlayer(colours, shapes) {
    if(this.playerId === null) {return}
    if(this.playerId === -1) { return }
    this.player.colour = colours[this.playerId%8]
    this.player.shape = shapes[Math.floor(this.playerId/8)]
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
    this._updateStarSprite()
    this._updateStarText()
    this._updateWarpGateGeometry()
    this._updateWormHole()
    this._updateWormHoleText()
    this._updatePlayerGeometry()
    this._updateInfrastructureText()
    this._updateNaturalResourcesText()
    this._updateSpecialistSprite()
    this._updateAsteroidFieldSprite()
    this._updateBinaryStarSprite()
    this._updateBlackHoleGeometry()
    this._updateNebulaSprite()
    this._updatePulsarGeometry()
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

  _updateNebulaSprite() {
    if( this.nebulaSprite ) {
      this.container.removeChild(this.nebulaSprite)
      this.nebulaSprite.destroy()
      this.nebulaSprite = null
    }
    if( this.isNebula ) {
      let nebulaTexture = TextureService.STAR_MODIFIERS['nebula']
      this.nebulaSprite = new PIXI.Sprite(nebulaTexture)
      this.nebulaSprite.anchor.set(0.5)
      this.nebulaSprite.width = 64*1.5
      this.nebulaSprite.height = 64*1.5
      this.container.addChild(this.nebulaSprite)
    }
  }

  _updateAsteroidFieldSprite() {
    if( this.asteroidFieldSprite ) {
      this.container.removeChild(this.asteroidFieldSprite)
      this.asteroidFieldSprite.destroy()
      this.asteroidFieldSprite = null
    }
    if( this.isAsteroidField ) {
      let asteroidFieldTexture = TextureService.STAR_MODIFIERS['asteroids']
      this.asteroidFieldSprite = new PIXI.Sprite(asteroidFieldTexture)
      this.asteroidFieldSprite.anchor.set(0.5)
      this.asteroidFieldSprite.scale.x = 1.5
      this.asteroidFieldSprite.scale.y = 1.5
      this.container.addChild(this.asteroidFieldSprite)
    }
  }

  _updateBlackHoleGeometry() {
    if( this.blackHole_geometry ) {
      this.container.removeChild(this.blackHole_geometry)
    }
    if( this.isBlackHole && !this.isBinaryStar ) {
      this.blackHole_geometry = new PIXI.Graphics()
      this.blackHole_geometry.lineStyle(2, 0x000000, 1.0)
      this.blackHole_geometry.beginFill()
      this.blackHole_geometry.drawCircle(0, 0, 6)
      this.blackHole_geometry.endFill()
      this.blackHole_geometry.lineStyle(2, 0xffffff, 1.0)
      this.blackHole_geometry.drawCircle(0, 0, 8)
      this.container.addChild(this.blackHole_geometry)
    }
  }

  _updateBinaryStarSprite() {
    if( this.binaryStarSprite ) {
      this.container.removeChild(this.binaryStarSprite)
      this.binaryStarSprite.destroy()
      this.binaryStarSprite = null
    }
    if( this.isBinaryStar ) {
      let binaryStarTexture = TextureService.STAR_MODIFIERS[this.isBlackHole ? 'blackhole_binary' : 'binary']
      this.binaryStarSprite = new PIXI.Sprite(binaryStarTexture)
      this.binaryStarSprite.anchor.set(0.5)
      this.binaryStarSprite.width = 24.0
      this.binaryStarSprite.height = 24.0
      this.container.addChild(this.binaryStarSprite)
    }
  }

  _updatePulsarGeometry() {
    if( this.pulsar_geometry ) {
      this.container.removeChild(this.pulsar_geometry)
    }
    if( this.isPulsar ) {
      this.pulsar_geometry = new PIXI.Graphics()
      this.pulsar_geometry.lineStyle(1, 0xffffff, 0.5)
      this.pulsar_geometry.moveTo(0, -20)
      this.pulsar_geometry.lineTo(0, 20)
      this.pulsar_geometry.drawEllipse(-5, 0, 5, 5)
      this.pulsar_geometry.drawEllipse(5, 0, 5, 5)
      this.pulsar_geometry.drawEllipse(-8, 0, 8, 8)
      this.pulsar_geometry.drawEllipse(8, 0, 8, 8)
      this.pulsar_geometry.rotation = Math.random()*Math.PI*2.0

      this.container.addChild(this.pulsar_geometry)
    }
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

  _updateWormHole() {
    if( this.wormHole_sprite ) {
      this.container.removeChild(this.wormHole_sprite)
    }
    if( this.wormHoleToStarId === -1 ) { return }
    this.wormHole_sprite = new PIXI.Sprite(TextureService.STAR_MODIFIERS['wormhole'])
    this.wormHole_sprite.anchor.set(0.5)
    this.wormHole_sprite.alpha = 0.5
    this.wormHole_sprite.width = 40.0
    this.wormHole_sprite.height = 40.0
    this.container.addChild(this.wormHole_sprite)
  }

  _updateWormHoleText() {
    if( this.wormHole_text ) {
      this.container.removeChild(this.wormHole_text)
    }
    if( this.wormHoleToStarId === -1 ) { return }
    let textString = `>${this.wormHoleToStarId}`
    this.wormHole_text = new PIXI.BitmapText(textString, Star.smallTextAttribs)
    this.wormHole_text.position.x = 12
    this.wormHole_text.position.y = -(this.wormHole_text.height/2.0)
    this.container.addChild(this.wormHole_text)
    //galaxyEditor.viewport.addChild(this.wormHole_text)
  }

  _updateStarSprite() {
    if( this.star_sprite ) {
      this.container.removeChild(this.star_sprite)
    }
    if( (this.specialistId >= 0) || this.isBlackHole || this.isBinaryStar || this.isPulsar) { return }
    this.star_sprite = new PIXI.Sprite(TextureService.STAR_SYMBOLS['scannable'])
    this.star_sprite.anchor.set(0.5)
    this.star_sprite.width = 12.0
    this.star_sprite.height = 12.0
    this.container.addChild(this.star_sprite)
  }

  _updateStarText() {
    if( this.star_text ) {
      this.container.removeChild(this.star_text)
    }
    let textString = `#${this.id}`
    this.star_text = new PIXI.BitmapText(textString, Star.smallTextAttribs)
    this.star_text.position.x = -12-(this.star_text.width)
    this.star_text.position.y = -(this.star_text.height/2.0)
    this.container.addChild(this.star_text)
    //galaxyEditor.viewport.addChild(this.star_text)
  }

  _updateNaturalResourcesText() {
    if( this.naturalResources_text ) {
      this.container.removeChild(this.naturalResources_text)
    }
    let textString = `${this.naturalResources.economy} ${this.naturalResources.industry} ${this.naturalResources.science}`
    this.naturalResources_text = new PIXI.BitmapText(textString, Star.textAttribs)
    this.naturalResources_text.position.x = -(this.naturalResources_text.width/2.0)
    this.naturalResources_text.position.y = 16
    this.container.addChild(this.naturalResources_text)
    //galaxyEditor.viewport.addChild(this.naturalResources_text)
  }

  _updateInfrastructureText() {
    //TODO use bitmap text, ignore if 0, change text without creating another object
    if( this.infrastructure_text ) {
      this.container.removeChild(this.infrastructure_text)
    }
    let textString = `${this.infrastructure.economy} ${this.infrastructure.industry} ${this.infrastructure.science}` 
    this.infrastructure_text = new PIXI.BitmapText(textString, Star.textAttribs)
    this.infrastructure_text.position.x = (-this.infrastructure_text.width/2.0)
    this.infrastructure_text.position.y = -16-(this.infrastructure_text.height)
    this.container.addChild(this.infrastructure_text)
    //galaxyEditor.viewport.addChild(this.infrastructure_text)
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
      id: this.id,
      location: this.location,
      naturalResources: this.naturalResources,
      //infrastructure: this.infrastructure,
      warpGate: this.warpGate,
      homeStar: this.homeStar,
      isAsteroidField: this.isAsteroidField,
      isBinaryStar: this.isBinaryStar,
      isBlackHole: this.isBlackHole,
      isNebula: this.isNebula,
      isPulsar: this.isPulsar,
      playerId: (this.playerId >= 0 ? this.playerId : null),
      specialistId: this.specialistId >= 0 ? this.specialistId : null,
      wormHoleToStarId: this.wormHoleToStarId >= 0 ? this.wormHoleToStarId : null
    })
  }

}

export default Star
