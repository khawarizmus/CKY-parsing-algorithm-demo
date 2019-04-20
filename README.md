# CKY parsing algorithm

Demo can be found [here](https://cyk.netlify.com)

This demo shows how a CYK algorithm works

# How Does it work

There two inputs on the web application:

- Grammar input: this is pre-filed with a default context free grammar in Chomsky Normal Form Grammar(CNFG).
- Sentence input: this is where you try sentence against your context free grammar, we provided few examples of valid and invalid sentences against the default context free grammar.
- The CFG used in the project is described in the section below. Any other CFG can also be used.
- Conversion of CFG to CNFG is done manually. The program **recognizes and accepts only CNFG** and not CFG directly.

# TODO

- [ ] Skipp empty cells for a better performance
- [ ] Add controlled animation to show how the algorithm work step by step

# Developers

For those who want to use this project bellow are the commands you need

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Run your end-to-end tests

```
yarn run test:e2e
```

### Run your unit tests

```
yarn run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# Credits

The CNFG along with the example sentences where taken from this [repo](https://github.com/abhijeetchopra/CKY-Parser) made by [@abhijeetchopra](abhijeetchopra)
