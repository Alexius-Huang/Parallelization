<template>
  <modal :class="{ closed: !$props.show }" width="60vw">
    <div class="form-wrapper new-ticket-form">
      <h1>Create New Ticket</h1>
      <label>
        <p>Title</p>
        <input
          v-model="inputs.title"
          type="text"
          placeholder="Title of the ticket"
        />
      </label>

      <label>
        <p>Description</p>
        <input
          v-model="inputs.description"
          type="text"
          placeholder="Description of the ticket"
        />
      </label>

      <label class="point-field">
        <p>Points</p>
        <input
          v-model="inputs.point"
          type="text"
        />
      </label>

      <label class="assign-epic-field">
        <p>Epic</p>
        <select-input
          :options="epicOptions"
          :title="selectInput.epicId.title"
          :value="selectInput.epicId.value"
          @input="handleChangeEpicOption"
        />
      </label>

      <div class="btn-wrapper">
        <button @click="$emit('close')">Cancel</button>
        <button @click="createNewTicket()">Submit</button>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import SelectInput from '@/components/SelectInput';

export default {
  components: { Modal, SelectInput },
  props: ['show', 'mutate-epic-id'],
  data() {
    return {
      inputs: {
        title: '',
        description: '',
        point: '',
        epicId: -1,
      },
      selectInput: {
        epicId: { title: 'Unassigned', value: -1 },
      },
    };
  },
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    epics() { return Array.from(this.epicsMap.values()); },
    epicOptions() {
      const options = this.epics.map(({ title, id }) => ({ title, value: id }));
      return [{ title: 'Unassigned', value: -1 }].concat(options);
    },
  },
  methods: {
    createNewTicket() {
      const {
        title,
        description,
        point,
        epicId,
      } = this.inputs;
      const input = {
        title: title.trim(),
        description: description.trim(),
        point: Number.parseFloat(point, 10),
        epicId,
      };

      this.$emit('submit', input);
      this.inputs.title = '';
      this.inputs.description = '';
      this.inputs.point = '';
      this.modal = false;
    },
    handleChangeEpicOption({ title, value }) {
      this.inputs.epicId = value;
      this.selectInput.epicId.title = title;
      this.selectInput.epicId.value = value;
    },
    changeEpicOption(id) {
      if (id === -1) {
        this.handleChangeEpicOption({ title: 'Unassigned', value: -1 });
      } else {
        this.handleChangeEpicOption({ title: this.epicsMap.get(id).title, value: id });
      }
    },
  },
};
</script>

<style scoped lang="sass">
@import '../../sass/_form.sass'

div.modal-content
  > div.form-wrapper
    &.new-ticket-form
      > label.point-field
        width: 20%
      > label.assign-epic-field
        margin-left: 10pt
        width: calc(80% - 10pt)
</style>
