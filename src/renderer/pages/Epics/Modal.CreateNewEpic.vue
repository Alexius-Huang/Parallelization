<template>
  <modal :class="{ closed: !$props.show }" width="60vw">
    <div class="form-wrapper">
      <h1>Create New Epic</h1>
      <label>
        <p>Epic Title</p>
        <input
          v-model="inputs.title"
          type="text"
          placeholder="Enter title of epic"
        />
      </label>

      <label>
        <p>Epic Description</p>
        <input
          v-model="inputs.description"
          type="text"
          placeholder="Enter description of epic"
        />
      </label>

      <label>
        <p>Epic Color</p>
        <color-input />
      </label>

      <div class="btn-wrapper">
        <button @click="$emit('close')">Cancel</button>
        <button @click="createNewEpic()">Submit</button>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import ColorInput from '@/components/ColorInput';

export default {
  components: { Modal, ColorInput },
  props: ['show'],
  data() {
    return {
      inputs: {
        title: '',
        description: '',
      },
    };
  },
  methods: {
    createNewEpic() {
      const { title, description } = this.inputs;
      const input = {
        title: title.trim(),
        description: description.trim(),
      };

      this.inputs.title = '';
      this.inputs.description = '';
      this.$emit('submit', input);
    },
  },
};
</script>

<style scoped lang="sass">
@import '../../sass/_form.sass'
</style>

