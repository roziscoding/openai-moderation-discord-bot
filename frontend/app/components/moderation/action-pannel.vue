<script setup lang="ts">
import { z } from 'zod'
import { useActions } from '../../composables/moderation/actions'

const props = defineProps<{
  action: string
}>()

const { getAction } = useActions()

const actionData = computed(() => {
  return getAction(props.action)
})
const actionConfig = computed(() => {
  // @ts-expect-error Zod types are hard =(
  return z.toJSONSchema(actionData.value.arguments ?? z.null(), { unrepresentable: true })
})

function getSchemaClass(type: string) {
  switch (type) {
    case 'boolean':
      return 'toggle checked:toggle-primary'
    default:
      return 'input input-primary'
  }
}

function getSchemaType(type: string) {
  switch (type) {
    case 'string':
      return 'text'
    case 'number':
      return 'number'
    case 'boolean':
      return 'checkbox'
    default:
      return undefined
  }
}

function insertPlaceholder(placeholder: string, id: string) {
  const textarea = document.querySelector<HTMLTextAreaElement>(`textarea#${id}`)
  const input = document.querySelector<HTMLInputElement>(`input#${id}`)
  const insertText = `{${placeholder}}`

  if (textarea) {
    const start = textarea.selectionStart ?? textarea.value.length
    const end = textarea.selectionEnd ?? textarea.value.length
    const value = textarea.value
    textarea.value = value.slice(0, start) + insertText + value.slice(end)
    // Move cursor after inserted text
    const cursorPos = start + insertText.length
    textarea.setSelectionRange(cursorPos, cursorPos)
    textarea.focus()
  }

  if (input) {
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const value = input.value
    input.value = value.slice(0, start) + insertText + value.slice(end)
    // Move cursor after inserted text
    const cursorPos = start + insertText.length
    input.setSelectionRange(cursorPos, cursorPos)
    input.focus()
  }
}
</script>

<template>
  <div>
    <div class="collapse bg-base-100 border-base-300 border">
      <input type="checkbox" name="action-pannel">
      <div class="collapse-title font-semibold">
        <span class="capitalize">{{ actionData.name }}</span> - {{ actionData.description }}
      </div>
      <div class="collapse-content text-sm">
        <div v-if="actionConfig.description" class="alert alert-info alert-soft mb-4">
          {{ actionConfig.description }}
        </div>
        <template v-if="actionConfig.type === 'object'">
          <form @submit.prevent>
            <fieldset v-for="[field, value] in Object.entries<any>(actionConfig.properties ?? {})" :key="field" class="fieldset">
              <legend class="fieldset-legend">
                {{ value.title }}
              </legend>
              <textarea
                v-if="value.type === 'string' || value.type === 'array'"
                :id="field"
                class="input w-full input-primary pt-2"
                :required="actionConfig.required?.includes(field)"
                :placeholder="value.placeholder"
              />
              <input
                v-else
                :id="field"
                :type="getSchemaType(value.type)"
                :class="getSchemaClass(value.type)"
                :required="actionConfig.required?.includes(field)"
                :placeholder="value.placeholder"
              >
              <p class="label">
                {{ value.description }}
              </p>
              <template v-if="value.availablePlaceholders">
                <p class="label">
                  Available placeholders: <template v-for="placeholder in value.availablePlaceholders" :key="placeholder">
                    <span
                      class="font-mono bg-primary/20 font-bold cursor-pointer"
                      @click="insertPlaceholder(placeholder, field)"
                    >
                      {{ '{' }}{{ placeholder }}{{ '}' }}
                    </span>
                  </template>
                </p>
              </template>
            </fieldset>
          </form>
        </template>
        <template v-else>
          <div class="alert alert-neutral">
            No configuration required
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
