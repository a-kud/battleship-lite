// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { shallow } from 'enzyme'
// import { visit } from './utils/visit'

// describe('App', () => {
//   test('loads on /', async () => {
//     const page = visit('/')
//     const selector = '#start-btn'
//     const text = await page.evaluate(() => document.body.textContent).end()
//     expect(text).toContain('Start')
//   })

//   test('has a game board', async () => {
//     const page = visit('/')
//     const selector = '.game-board'
//     const cardCount = await page
//       .wait(selector)
//       .evaluate(sel => document.querySelectorAll(sel).length, selector)
//       .end()

//     expect(cardCount).toEqual(1)
//   })
//   test('contains welcome header', () => {
//     const wrapper = shallow(<App />)
//     expect(wrapper.text()).toContain('Welcome to Battleship')
//   })
// })
