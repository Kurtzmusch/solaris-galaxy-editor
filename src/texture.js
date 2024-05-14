import * as PIXI from 'pixi.js-legacy'
import gameHelper from './gameHelper'

class TextureService {
    DEFAULT_FONT_STYLE = null

    STARLESS_NEBULA_TEXTURES = []
    NEBULA_TEXTURES = []
    SPECIALIST_TEXTURES = {}

    STAR_SYMBOLS = {}
    STAR_MODIFIERS = {}

    initialize () { //TODO since both game and editor uses this. it should bot be initialized by both
      this._loadStarSymbols()
      this._loadStarModifiers()

      this.DEFAULT_FONT_STYLE = new PIXI.TextStyle({
        fontFamily: `'Arial'`,
        fill: 0xFFFFFF,
        padding: 3
      })

      this.DEFAULT_FONT_STYLE_BOLD = new PIXI.TextStyle({
        fontFamily: `'Space Mono', monospace`,
        fill: 0xFFFFFF,
        fontWeight: "bold",
        padding: 3
      })

      this.DEFAULT_FONT_BITMAP = PIXI.BitmapFont.from(
        "Arial",
        this.DEFAULT_FONT_STYLE,
        {
          chars: PIXI.BitmapFont.ASCII,
          resolution: 2
        }
      )
      // disable mipmap 
      this.DEFAULT_FONT_BITMAP.pageTextures[0].baseTexture.mipmap = 0
      this.DEFAULT_FONT_BITMAP.pageTextures[1].baseTexture.mipmap = 0

      this.DEFAULT_FONT_BOLD_BITMAP = PIXI.BitmapFont.from(
        "space-mono-bold",
        this.DEFAULT_FONT_STYLE_BOLD,
        {
          chars: PIXI.BitmapFont.ASCII,
          resolution: 2
        }
      )
      // disable mipmap 
      this.DEFAULT_FONT_BOLD_BITMAP.pageTextures[0].baseTexture.mipmap = 0
      this.DEFAULT_FONT_BOLD_BITMAP.pageTextures[1].baseTexture.mipmap = 0



      // SPECIALISTS
      this._loadSpecialistTexture('mecha-head')
      this._loadSpecialistTexture('mecha-mask')
      this._loadSpecialistTexture('android-mask')
      this._loadSpecialistTexture('hazmat-suit')
      this._loadSpecialistTexture('cyborg-face')
      this._loadSpecialistTexture('lunar-module')
      this._loadSpecialistTexture('spaceship')
      this._loadSpecialistTexture('power-generator')
      this._loadSpecialistTexture('energise')
      this._loadSpecialistTexture('sattelite')
      this._loadSpecialistTexture('airtight-hatch')
      this._loadSpecialistTexture('cannister')
      this._loadSpecialistTexture('defense-satellite')
      this._loadSpecialistTexture('habitat-dome')
      this._loadSpecialistTexture('techno-heart')
      this._loadSpecialistTexture('missile-pod')
      this._loadSpecialistTexture('space-suit')
      this._loadSpecialistTexture('strafe')
      this._loadSpecialistTexture('ringed-planet')
      this._loadSpecialistTexture('observatory')
      this._loadSpecialistTexture('alien-stare')
      this._loadSpecialistTexture('afterburn')
      this._loadSpecialistTexture('pirate')
      this._loadSpecialistTexture('spoutnik')
      this._loadSpecialistTexture('starfighter')
      this._loadSpecialistTexture('double-ringed-orb')
      this._loadSpecialistTexture('rocket')
      this._loadSpecialistTexture('radar-dish')
      this._loadSpecialistTexture('energy-tank')
      this._loadSpecialistTexture('cryo-chamber')
      this._loadSpecialistTexture('rocket-thruster')
      this._loadSpecialistTexture('targeting')
      this._loadSpecialistTexture('star-gate')
    }

    _loadStarModifiers() {
      this.STAR_MODIFIERS['nebula'] = new PIXI.Texture(PIXI.BaseTexture.from(require('./assets/star-nebula-0.png')))
      this.STAR_MODIFIERS['asteroids'] = new PIXI.Texture(PIXI.BaseTexture.from(require('./assets/star-asteroid-field-0.png')))
      this.STAR_MODIFIERS['binary'] = new PIXI.Texture(PIXI.BaseTexture.from(require('./assets/128x128_star_scannable_binary.svg')))
      this.STAR_MODIFIERS['blackhole_binary'] = new PIXI.Texture(PIXI.BaseTexture.from(require('./assets/128x128_star_black_hole_binary.svg')))
      this.STAR_MODIFIERS['wormhole'] = new PIXI.Texture(PIXI.BaseTexture.from(require('./assets/vortex.png')))
    }
    _loadStarSymbols() {
      this.STAR_SYMBOLS['scannable'] = new PIXI.Texture(PIXI.BaseTexture.from(require('./assets/128x128_star_scannable.svg')))
    }

    _loadSpecialistTexture(name) {
      this.SPECIALIST_TEXTURES[name] = PIXI.Texture.from(require(`./assets/specialists/${name}.svg`))
      //disable mipmap
      this.SPECIALIST_TEXTURES[name].baseTexture.mipmap = 0
    }

    getSpecialistTexture(specialistId, isCarrier) {
      let name = gameHelper.getSpecialistName(isCarrier ? 'carrier':'star', specialistId)

      return this.SPECIALIST_TEXTURES[name]
    }
}

export default new TextureService()
