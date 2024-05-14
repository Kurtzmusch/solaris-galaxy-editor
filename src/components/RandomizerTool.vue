<template>
  <div id="randomizer-tools" class=''>
    <div class='container'>
      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Position Range</label>
        </div>
      </div>
      <div class='row'>
        <div class='col-3'>
          <input class='form-control' type="number" v-model.number='positionRange.min'/>
        </div>
        <div class='col-3'>
          <input class='form-control' type="number" v-model.number='positionRange.max'/>
        </div>
        <div class='col-6'>
          <button @click="randomizePositions" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i> Randomize Positions</button>
        </div>
      </div>

      <br/>
      <br/>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Split Resources</label>
        </div>
        <div class='col-6'>
          <input class='form-check-input' type='checkbox' v-model='splitResources'/>
        </div>
      </div>

      <div class='container g-0' v-show='!splitResources'>
        <div class='row'>
          <div class='col-6'>
            <label class='col-form-label'>Resources Range</label>
          </div>
        </div>
        <div class='row'>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesAllRange.min'/>
          </div>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesAllRange.max'/>
          </div>
          <div class='col-6'>
            <button @click="randomizeResources" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Resources</button>
          </div>
        </div>
      </div>

      <div class='container g-0' v-show='splitResources'>
        <div class='row'>
          <div class='col-6'>
            <label class='col-form-label'>Economy Range</label>
          </div>
        </div>
        <div class='row'>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesRange.economy.min'/>
          </div>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesRange.economy.max'/>
          </div>
          <div class='col-6'>
            <button @click="randomizeResourceEconomy" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Economy</button>
          </div>
        </div>

        <div class='row'>
          <div class='col-6'>
            <label class='col-form-label'>Industry Range</label>
          </div>
        </div>
        <div class='row'>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesRange.industry.min'/>
          </div>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesRange.industry.max'/>
          </div>
          <div class='col-6'>
            <button @click="randomizeResourceIndustry" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Industry</button>
          </div>
        </div>

        <div class='row'>
          <div class='col-6'>
            <label class='col-form-label'>Science Range</label>
          </div>
        </div>
        <div class='row'>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesRange.science.min'/>
          </div>
          <div class='col-3'>
            <input class='form-control' type="number" v-model.number='resourcesRange.science.max'/>
          </div>
          <div class='col-6'>
            <button @click="randomizeResourceScience" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Science</button>
          </div>
        </div>
      </div>

      <br/>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Asteroid Field Range</label>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <input class='form-range v-center-range' type="range" v-model.number='asteroidFieldRange'/>
        </div>
        <div class='col-6'>
          <button @click="randomizeAsteroidFields" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Asteroids</button>
        </div>
      </div>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Binary Star Range</label>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <input class='form-range v-center-range' type="range" v-model.number='binaryStarRange'/>
        </div>
        <div class='col-6'>
          <button @click="randomizeBinaryStars" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Binary Stars</button>
        </div>
      </div>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Black Hole Range</label>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <input class='form-range v-center-range' type="range" v-model.number='blackHoleRange'/>
        </div>
        <div class='col-6'>
          <button @click="randomizeBlackHoles" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Black Holes</button>
        </div>
      </div>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Nebula Range</label>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <input class='form-range v-center-range' type="range" v-model.number='nebulaRange'/>
        </div>
        <div class='col-6'>
          <button @click="randomizeNebulas" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Nebulas</button>
        </div>
      </div>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Pulsar Range</label>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <input class='form-range v-center-range' type="range" v-model.number='pulsarRange'/>
        </div>
        <div class='col-6'>
          <button @click="randomizePulsars" class='btn btn-primary col-12'><i class="fa fa-chevron-down"></i>Randomize Pulsars</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GalaxyEditor from '../editor'

export default {
  data () {
    return {
      galaxyEditor: GalaxyEditor,
      positionRange: { min: 0.0, max: 0.125 },
      resourcesAllRange: { min: 0, max: 100 },
      resourcesRange: {
        economy: { min: 0, max: 100 },
        industry: { min: 0, max: 100 },
        science: { min: 0, max: 100 }
      },
      asteroidFieldRange: 0,
      blackHoleRange: 0,
      binaryStarRange: 0,
      nebulaRange: 0,
      pulsarRange: 0,
      splitResources: false
    }
  },
  methods: {
    randomizePositions() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let posRange = this.positionRange.max-this.positionRange.min
        let xOffset = (2.0*Math.random()-1.0)*posRange*50.0
        let yOffset = (2.0*Math.random()-1.0)*posRange*50.0
        star.location.x += xOffset+(Math.sign(xOffset)*this.positionRange.min*50.0)
        star.location.y += yOffset+(Math.sign(yOffset)*this.positionRange.min*50.0)
        star.updatePosition()
      }
    },
    randomizeResources() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let resourceRange = this.resourcesAllRange.max-this.resourcesAllRange.min
        let resourceValue = Math.floor(this.resourcesAllRange.min+this.resourcesRange.economy.min+resourceRange*Math.random())
        star.naturalResources.economy = resourceValue
        star.naturalResources.industry = resourceValue
        star.naturalResources.science = resourceValue
        star._updateNaturalResourcesText()
      }
    },
    randomizeResourceEconomy() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let resourceRange = this.resourcesRange.economy.max-this.resourcesRange.economy.min
        star.naturalResources.economy = Math.floor(this.resourcesRange.economy.min+resourceRange*Math.random())
        star._updateNaturalResourcesText()
      }
    },
    randomizeResourceIndustry() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let resourceRange = this.resourcesRange.industry.max-this.resourcesRange.industry.min
        star.naturalResources.industry = Math.floor(this.resourcesRange.industry.min+resourceRange*Math.random())
        star._updateNaturalResourcesText()
      }
    },
    randomizeResourceScience() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let resourceRange = this.resourcesRange.science.max-this.resourcesRange.science.min
        star.naturalResources.science = Math.floor(this.resourcesRange.science.min+resourceRange*Math.random())
        star._updateNaturalResourcesText()
      }
    },
    randomizeNebulas() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let threshold = Math.random()*100
        star.isNebula = false
        if( threshold < this.nebulaRange) {
          star.isNebula = true
        }
        star._updateGraphics()
      }
    },
    randomizeAsteroidFields() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let threshold = Math.random()*100
        star.isAsteroidField = false
        if( threshold < this.asteroidFieldRange) {
          star.isAsteroidField = true
        }
        star._updateGraphics()
      }
    },
    randomizeBlackHoles() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let threshold = Math.random()*100
        star.isBlackHole = false
        if( threshold < this.blackHoleRange) {
          star.isBlackHole = true
        }
        star._updateGraphics()
      }
    },
    randomizeBinaryStars() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let threshold = Math.random()*100
        star.isBinaryStar = false
        if( threshold < this.binaryStarRange) {
          star.isBinaryStar = true
        }
        star._updateGraphics()
      }
    },
    randomizePulsars() {
      let stars = this.galaxyEditor.stars
      for(let star of stars) {
        let threshold = Math.random()*100
        star.isPulsar = false
        if( threshold < this.pulsarRange) {
          star.isPulsar = true
        }
        star._updateGraphics()
      }
    }
  }
}
</script>

<style>
  #randomizer-tools {
    position: absolute;
    width: 25%;
  }
  .v-center-range {
    margin-top: 8px;
  }
</style>
