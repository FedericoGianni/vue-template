import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from '.'

describe('Button', () => {
  it('renders properly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies variant classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'destructive',
      },
      slots: {
        default: 'Delete',
      },
    })
    expect(wrapper.classes()).toContain('bg-destructive')
  })

  it('applies size classes', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'sm',
      },
      slots: {
        default: 'Small',
      },
    })
    expect(wrapper.classes()).toContain('h-9')
  })
})
