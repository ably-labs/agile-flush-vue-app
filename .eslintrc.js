module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "airbnb-base",
    "prettier",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: [
    "vue",
  ],
  rules: {
    "arrow-body-style": "off",
    "no-underscore-dangle": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "import/prefer-default-export" : "off"
  },
};
