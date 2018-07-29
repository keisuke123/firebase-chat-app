import Vue from 'vue'

// こいつでルーティングを定義する
import Router from 'vue-router'

// コンポーネントはこのフォーマットでインポートする
import Main from '@/components/Main'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'

import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      meta: { requiredAuth: true }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }    
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiredAuth)){

    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        // User is signed in.
        next()
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath }
        })
      }
    })
  }else{
    next()
  }
})

export default router