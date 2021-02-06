import { ComponentOptions } from 'vue'

import { stringifyQuery } from '@dcloudio/uni-shared'

import {
  ParseComponentOptions,
  parseComponent,
  CustomComponentInstanceProperty,
} from './component'
import { PAGE_HOOKS, initHooks, initUnknownHooks } from './componentHooks'

function parsePage(
  vueOptions: ComponentOptions,
  parseOptions: ParseComponentOptions
) {
  const {
    parse,
    mocks,
    isPage,
    initRelation,
    handleLink,
    initLifetimes,
  } = parseOptions
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks,
    isPage,
    initRelation,
    handleLink,
    initLifetimes,
  })

  const methods = miniProgramPageOptions.methods as WechatMiniprogram.Component.MethodOption

  methods.onLoad = function (this: CustomComponentInstanceProperty, query) {
    ;(this as any).options = query
    ;(this as any).$page = {
      fullPath: '/' + (this as any).route + stringifyQuery(query),
    }
    return this.$vm && this.$vm.$callHook('onLoad', query)
  }

  initHooks(methods, PAGE_HOOKS)
  initUnknownHooks(methods, vueOptions)

  parse && parse(miniProgramPageOptions, { handleLink })

  return miniProgramPageOptions
}

export function initCreatePage(parseOptions: ParseComponentOptions) {
  return function createPage(vuePageOptions: ComponentOptions) {
    return Component(parsePage(vuePageOptions, parseOptions))
  }
}