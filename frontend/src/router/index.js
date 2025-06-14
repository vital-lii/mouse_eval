import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/mice',
    name: 'Mice',
    component: () => import('../views/mice/List.vue'),
    meta: {
      title: '小鼠管理'
    }
  },
  {
    path: '/evaluations',
    name: 'Evaluations',
    component: () => import('../views/evaluations/List.vue'),
    meta: {
      title: '评估记录'
    }
  },
  {
    path: '/evaluations/new',
    name: 'NewEvaluation',
    component: () => import('../views/evaluations/Form.vue'),
    meta: {
      title: '添加评分'
    }
  },
  {
    path: '/training',
    name: 'Training',
    component: () => import('../views/training/Record.vue'),
    meta: {
      title: '训练记录'
    }
  },
  {
    path: '/acupuncture',
    name: 'Acupuncture',
    component: () => import('../views/acupuncture/Record.vue'),
    meta: {
      title: '针刺记录'
    }
  },
  // 添加详情页路由
  {
    path: '/mice/:id',
    name: 'MouseDetail',
    component: () => import('../views/mice/Detail.vue'),
    meta: {
      title: '小鼠详情'
    }
  },
  {
    path: '/evaluations/:id',
    name: 'EvaluationDetail',
    component: () => import('../views/evaluations/Detail.vue'),
    meta: {
      title: '评估详情'
    }
  },
  {
    path: '/training/:id',
    name: 'TrainingDetail',
    component: () => import('../views/training/Detail.vue'),
    meta: {
      title: '训练详情'
    }
  },
  {
    path: '/acupuncture/:id',
    name: 'AcupunctureDetail',
    component: () => import('../views/acupuncture/Detail.vue'),
    meta: {
      title: '针刺详情'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 小鼠评估系统` : '小鼠评估系统'
  next()
})

// 错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  // 可以在这里添加错误处理逻辑，比如显示错误提示或重定向
})

export default router 