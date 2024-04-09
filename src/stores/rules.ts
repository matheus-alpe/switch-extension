import { ref, toRaw, unref } from 'vue'
import { storage } from '../utils'
import { type RuleForm } from '../composables/form'

function rulesStore() {
  const KEY = 'rules'
  const rules = ref<RuleForm[]>([])
  const currentRule = ref<RuleForm | null>(null)

  storage.get<RuleForm[]>(KEY).then((value) => {
    rules.value = value || []
  })

  async function save() {
    await storage.set(KEY, toRaw(rules.value))
  }

  function create(rule: RuleForm): Promise<void> {
    rules.value.push(rule)
    return save()
  }

  function findById(id: number): number {
    return rules.value.findIndex((r) => r.id === id)
  }

  function update(rule: RuleForm): Promise<void> {
    const index = findById(rule.id)
    if (index === -1) return Promise.reject()

    rules.value.splice(index, 1, rule)
    return save()
  }

  function remove(index: number): Promise<void> {
    rules.value.splice(index, 1)
    return save()
  }

  function removeById(id: number): Promise<void> {
    const index = findById(id)
    if (index === -1) return Promise.reject()

    return remove(index)
  }

  return () => ({
    rules,
    currentRule,
    save,
    create,
    update,
    remove,
    removeById,
  })
}

export default rulesStore()
