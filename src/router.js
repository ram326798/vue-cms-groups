import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Edit from './components/Edit.vue'
import Read from './components/Read.vue'
import Auth from '@okta/okta-vue'
import { isInGroup } from './user'

Vue.use(Router);
Vue.use(Auth, {
  issuer: 'https://dev-2069012.okta.com/oauth2/default',
  client_id: '0oa30lojfsCxhn5MT5d6',
  redirect_uri: window.location.origin + '/callback',
  scopes: ['openid','profile'],
  pkce: true
});

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/read',
      name: 'read',
      component: Read,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit,
      meta: { requiresAuth: true },
      beforeEnter: async (to, from, next) => {
        next(await isInGroup('editor'));
      }
    },
    {
      path: '/callback',
      component: Auth.handleCallback()
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        next('/');
      }
    }
  ]
});

router.safeNavigate = function(route, dest) {
  if (route.name != dest) this.push({ name: dest });
}

router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

export default router;