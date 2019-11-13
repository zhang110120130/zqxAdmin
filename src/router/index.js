import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/login'
import Company from '@/components/company'
import News from '@/components/news'
import System from "@/components/news/system";
import ProductManage from '@/components/product/manage'
import ProductDraft from '@/components/product/draft'
import addProduct from '@/components/product/addProduct'
import sellOrder from '@/components/order/sell'
import group from '@/components/order/group'
import lease from '@/components/order/lease'
import groupBusiness from '@/components/business/group'
import leaseBusiness from '@/components/business/lease'
import sellBusiness from '@/components/business/sell'

Vue.use(Router);
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/company',
      children: [
        {
          path: 'company',
          component: Company
        },
        {
          path: 'ProductManage',
          component: ProductManage
        },
        {
          path: 'ProductDraft',
          component: ProductDraft
        },
        {
          path: 'addProduct',
          name: 'addProduct',
          component: addProduct
        },
        {
          path: 'sellOrder',
          component: sellOrder
        },
        {
          path: 'groupBusiness',
          component: groupBusiness
        },
        {
          path: 'leaseBusiness',
          component: leaseBusiness
        },
        {
          path: 'sellBusiness',
          component: sellBusiness
        },
        {
          path: 'news/:time',
          name: 'news',
          component: News
        },
        {
          path: 'system',
          component: System
        },
        {
          path: 'group',
          component: group
        },
        {
          path: 'lease',
          component: lease
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ]
});
export default router;
