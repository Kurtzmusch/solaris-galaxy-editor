<template>
  <div id="star-attributes" v-if="galaxyEditor.selectedStar" >
    <div class='container'>
      <div class='row'>
        <label class='col-6 col-form-label'>Selected Star #{{ galaxyEditor.selectedStar.id }}</label>
      </div>

      <div class='row'>
        <label class='col-6 col-form-label'>Infrastructure</label>
      </div>
      <div class='row'>
        <div class='col'>
          <label class='col-form-label'>Economy</label>
        </div>
        <div class='col-6'>
          <input class='form-control' type='number' v-model.number='galaxyEditor.selectedStar.infrastructure.economy'/>
        </div>
      </div>
      <div class='row'>
        <div class='col'>
          <label class='col-form-label'>Industry</label>
        </div>
        <div class='col-6'>
          <input class='form-control' type='number' v-model.number='galaxyEditor.selectedStar.infrastructure.industry'/>
        </div>
      </div>
      <div class='row'>
        <div class='col'>
          <label class='col-form-label'>Science</label>
        </div>
        <div class='col-6'>
          <input class='form-control' type='number' v-model.number='galaxyEditor.selectedStar.infrastructure.science'/>
        </div>
      </div>

      <br/>

      <div class='row'>
        <label class='col-6 col-form-label'>Natural Resources</label>
      </div>
      <div class='row'>
        <div class='col'>
          <label class='col-form-label'>Economy</label>
        </div>
        <div class='col-6'>
          <input class='form-control' type='number' v-model.number='galaxyEditor.selectedStar.naturalResources.economy'/>
        </div>
      </div>
      <div class='row'>
        <div class='col'>
          <label class='col-form-label'>Industry</label>
        </div>
        <div class='col-6'>
          <input class='form-control' type='number' v-model.number='galaxyEditor.selectedStar.naturalResources.industry'/>
        </div>
      </div>
      <div class='row'>
        <div class='col'>
          <label class='col-form-label'>Science</label>
        </div>
        <div class='col-6'>
          <input class='form-control' type='number' v-model.number='galaxyEditor.selectedStar.naturalResources.science'/>
        </div>
      </div>

      <br/>

      <div class='row'>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.warpGate' id='warpGateCheck'/>
            <label class='form-check-label' for='warpGateCheck'>Warp Gate</label>
          </div>
        </div>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.homeStar' id='homeStarCheck'/>
            <label class='form-check-label' for='homeStarCheck'>Home Star</label>
          </div>
        </div>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.isAsteroidField' id='astroidFieldCheck'/>
            <label class='form-check-label' for='astroidFieldCheck'>Asteroid Field</label>
          </div>
        </div>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.isBinaryStar' id='binaryStarCheck'/>
            <label class='form-check-label' for='binaryStarCheck'>Binary Star</label>
          </div>
        </div>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.isBlackHole' id='blackHoleCheck'/>
            <label class='form-check-label' for='blackHoleCheck'>Black Hole</label>
          </div>
        </div>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.isNebula' id='nebulaCheck'/>
            <label class='form-check-label' for='nebulaCheck'>Nebula</label>
          </div>
        </div>
        <div class='col-auto'>
          <div class='form-check'>
            <input class='form-check-input' type='checkbox' v-model='galaxyEditor.selectedStar.isPulsar' id='pulsarCheck'/>
            <label class='form-check-label' for='pulsarCheck'>Pulsar</label>
          </div>
        </div>
      </div>

      <br/>

      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Player</label>
        </div>
        <div class='col-6'>
          <select class='form-select' v-model.number='galaxyEditor.selectedStar.playerId'>
            <option value='-1'>None</option>
            <option v-for='(playerShapeAndColour,index) in playerShapeAndColours' v-bind:value='index' :key='index'>{{ playerShapeAndColour }}</option>
          </select>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Specialist</label>
        </div>
        <div class='col-6'>
          <select class='form-select' v-model.number='galaxyEditor.selectedStar.specialistId'>
            <option value='-1'>None</option>
            <option v-for='(specialist,index) in specialists' v-bind:value='specialist.id' :key='index'>{{specialist.name}}</option>
          </select>
        </div>
      </div>
      <div class='row'>
        <div class='col-6'>
          <label class='col-form-label'>Worm Hole to Star</label>
        </div>
        <div class='col-6'>
          <select class='form-select' v-model.number='galaxyEditor.selectedStar.wormHoleToStarId' v-on:input='updateWormHoleToStarId'>
            <option value='-1'>None</option>
            <option v-for='(star,index) in stars' v-bind:value='star.id' :key='index' :disabled='star.id === galaxyEditor.selectedStar.id || star.wormHoleToStarId !== -1'>Star #{{star.id}}</option>
          </select>
        </div>
      </div>
      
      <br/>

      <div class='row'>
        <div class='col-6'>
          <button @click="updateStar" class='col-12 btn btn-warning'>Update</button>
        </div>
        <div class='col-6'>
          <button @click="destroyStar" class='col-12 btn btn-danger'>Destroy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GalaxyEditor from '../editor'
  export default {
    data() {
      return {
        galaxyEditor: GalaxyEditor
      }
    },
    methods: {
      updateStar() {
        this.galaxyEditor.updateSelected()
      },
      destroyStar() {
        this.galaxyEditor.destroySelected()
      },
      updateSpecialistID(id) {
        this.galaxyEditor.selectedStar.specialistId = id
      },
      updateWormHoleToStarId(e) {
        const targetId = parseFloat(e.target.value)
        this.galaxyEditor.updateWormHoleToStarId(targetId)
      }
    },
    computed: {
      specialists() {
        return this.galaxyEditor.specialists
      },
      playerShapeAndColours() {
        return this.galaxyEditor.playerShapeAndColours
      },
      stars() {
        return this.galaxyEditor.stars
      }
    }
  }
</script>

<style>
  #star-attributes {
    position: absolute;
    width: 25%;
  }
</style>
