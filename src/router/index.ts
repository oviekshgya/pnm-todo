import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LoginPage.vue'
import Register from '@/views/RegisterPage.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    }, 
    {
        path: '/register',
        name: 'Register',
        component: Register,
    }, 
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
  
  export default router