<template>
  <modal :class="{ closed: !$props.show }" width="60vw">
    <div class="form-wrapper new-board-form">
      <h1>Create New Board</h1>
      <label>
        <p>Scrum Board Title</p>
        <input
          v-model="inputs.title"
          type="text"
          placeholder="Enter title of scrum board"
        />
      </label>

      <label>
        <p>Scrum Board Description</p>
        <input
          v-model="inputs.description"
          type="text"
          placeholder="Enter description of scrum board"
        />
      </label>

      <label class="column-list-field">
        <p>Scrum Board Columns</p>
        <list-input
          ref="listInput"
          :default-inputs="['TODO', 'In Progress', 'Completed']"
          placeholder="Column Name"
        />
      </label>

      <label class="color-field">
        <p>Scrum Board Color</p>
        <color-input ref="colorInput" />
      </label>

      <div class="btn-wrapper">
        <button @click="$emit('close')">Cancel</button>
        <button @click="createNewBoard()">Submit</button>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import ColorInput from '@/components/ColorInput';
import ListInput from '@/components/ListInput';

export default {
  components: { Modal, ColorInput, ListInput },
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
    createNewBoard() {
      const { title, description } = this.inputs;
      const { colorInput, listInput } = this.$refs;
      const input = {
        title: title.trim(),
        description: description.trim(),
        color: colorInput.selected,
        columns: listInput.list,
      };

      this.inputs.title = '';
      this.inputs.description = '';
      this.$refs.listInput.list = ['TODO', 'In Progress', 'Completed'];
      this.$emit('submit', input);
    },
  },
};
</script>

<style scoped lang="sass">
@import '../../sass/_form.sass'

div.modal-content
  > div.form-wrapper
    &.new-board-form
      font-size: 0
      > label.column-list-field
        width: 70%
        vertical-align: top
      > label.color-field
        margin-left: 20pt
        vertical-align: top
        width: calc(30% - 20pt)
</style>

