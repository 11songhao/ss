import store from '@/store'

export default {
  data () {
    return {
      test: 1000
    }
  },
  created () {
    // console.log('i mix!')
  },
  methods: {
    checkPoints (key) {
      const { userInfo } = store.state.user
      // if (userInfo.roles?.points && userInfo.roles.points.length) {
      // return userInfo.roles?.points.some(item => item === key)
      return userInfo.roles?.points.includes(key)
      // }
      // return false
    }
  }
}
