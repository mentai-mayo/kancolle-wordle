
window.addEventListener('load', async ()=>{
  
  /**
   * history
   * @type { { str: string, result: ('wrong'|'exist'|'true')[] }[] }
   */
  let history = [
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
  ];
  history.cur = 0;

  /**
   * wordle answer
   * @type { { id: number, chars: string, name: string, type: string, class: string } }
   */
  let answer = null;

  /**
   * max characters of ship name
   * @type { number }
   */
  const maxCharacterNumber = 7;

  /**
   * max numbers of challenge
   * @type { number }
   */
  const maxChallengeCount = 10;

  /**
   * ship list
   * @type { { id: number, chars: string, name: string, type: string, class: string }[] }
   */
  const ShipList = await fetch('ships.json').then((dat)=>dat.json());
  
  /**
   * keypad character list
   * @type { { default: string, special: string } }
   */
  const keys = {
    default: 'ワラヤマハナタサカア リ ミヒニチシキイヲルユムフヌツスクウ レ メヘネテセケエンロヨモホノトソコオ',
    special: 'ーャパバ ダザガ ァ  ピビ ヂジギ ィ ュプブッヅズグヴゥ  ペベ デゼゲ ェ ョポボ ドゾゴ ォ',
  };

  // generate history-wordbox
  for(const _ in new Array(10).fill(null)){
    let wordBox = (e=>e.classList.add('word-box', 'history')||e)(document.createElement('div'));
    for(const __ in new Array(7).fill(null)){
      wordBox.appendChild((e=>e.classList.add('char-box')||e)(document.createElement('div')));
    }
    document.querySelector('#history').appendChild(wordBox);
  }

  // generate keypad keybox & add event listener
  for(const char of keys.default){
    /**
     * @type { Element }
     */
    let charBox = document.createElement('div');
    if(char == ' '){
      charBox.classList.add('none');
    } else{
      charBox.dataset.beforeInput = char;
      charBox.addEventListener('click', ()=>pushKeyboard(char));
    }
    document.querySelector('#default-keyboard').appendChild(charBox);
  }
  for(const char of keys.special){
    /**
     * @type { Element }
     */
    let charBox = document.createElement('div');
    if(char == ' '){
      charBox.classList.add('none');
    } else{
      charBox.dataset.beforeInput = char;
      charBox.addEventListener('click', ()=>pushKeyboard(char));
    }
    document.querySelector('#special-keyboard').appendChild(charBox);
  }

  // generate ship-list
  ShipList.sort().forEach((data)=>{
    const element = document.createElement('div');
    element.appendChild((e=>{e.innerText=data.chars;return e})(document.createElement('span')));
    element.appendChild((e=>{e.innerText=data.name;return e})(document.createElement('span')));
    document.querySelector('div#ship-list-window > div[data-ident="list"]').appendChild(element);
  });

  // key input observer
  window.addEventListener('keyup', (event)=>{
    if(event.ctrlKey && event.key == '/'){
      if(document.querySelector('div#cmdline').classList.contains('display')){
        document.querySelector('div#cmdline').classList.remove('display');
        document.querySelector('div#cmdline > div > input').blur();
        document.querySelector('div#cmdline > div > input').value = '';
      } else{
        document.querySelector('div#cmdline').classList.add('display');
        document.querySelector('div#cmdline > div > input').focus();
      }
    }
    if(event.key == 'Escape' && document.querySelector('div#cmdline').classList.contains('display')){
      document.querySelector('div#cmdline').classList.remove('display');
      document.querySelector('div#cmdline > div > input').blur();
      document.querySelector('div#cmdline > div > input').value = '';
    }
    if(event.key == 'Enter' && document.querySelector('div#cmdline').classList.contains('display')){
      document.querySelector('div#cmdline').classList.remove('display');
      cmdlineInput(document.querySelector('div#cmdline > div > input').value);
      document.querySelector('div#cmdline > div > input').blur();
      document.querySelector('div#cmdline > div > input').value = '';
    }
    // console.log('key:', event.key);
  });

  // set enter/delete/reset button listener
  [ {id: 'enter', entry: pushEnterKey}, {id: 'delete', entry: pushDeleteKey}, {id: 'surrender', entry: pushResetKey} ].forEach((data)=>{
    document.querySelector(`#${data.id}-btn`).addEventListener('click', ()=>data.entry());
  });

  // set restart button (at result window) listener
  document.querySelector('div#game-result-window > div[data-ident="buttons"] > span').addEventListener('click', (event)=>{
    document.querySelector('div#game-result').classList.remove('display');
    startNewGame();
  });

  // set ship-list button listener
  document.querySelector('div#ship-list-btn > img').addEventListener('click', ()=>{
    document.querySelector('div#ship-list').classList.toggle('display');
  });

  // set ship-list listener
  document.querySelector('div#ship-list').addEventListener('click', (event)=>{
    event.target.classList.remove('display');
  });

  // key inputs
  /**
   * push character key
   * @param { string } character input character
   */
  function pushKeyboard(character){
    if(history[history.cur].str.length < maxCharacterNumber)
      history[history.cur].str += character;
    // console.log(`[${character}    ]`, history);
    flipCharacters();
  }
  /**
   * push enter key
   */
  function pushEnterKey(){
    if(!isShipName(history[history.cur].str)){
      makePopupWindow(`"${history[history.cur].str}"という名前の艦娘はいません`);
      return;
    }
    history[history.cur].result = checkShipName(history[history.cur].str);
    flipCharacters();
    usedCharacterHighlights();
    if(history[history.cur].str == answer.chars){
      displayResult('Clear');
      return;
    }
    if(history.cur == maxChallengeCount - 1){
      displayResult('GameOver');
      return;
    }
    history.cur++;
    // console.log(`[Enter ]`, history);
  }
  /**
   * push delete key
   */
  function pushDeleteKey(){
    history[history.cur].str = history[history.cur].str.slice(0, -1);
    // console.log(`[Delete]`, history);
    flipCharacters();
  }
  /**
   * push reset (new game) key
   */
  function pushResetKey(){
    makePopupQuestion('現在のゲームを諦めますか？', ['諦める', 'やっぱり続ける'], (selected)=>{
      if(selected == 1) displayResult('Surrender');
    });
  }

  /**
   * cmdline input
   * @param { string } command
   */
  function cmdlineInput(command){
    // inputs
    if(/^([\u30a1-\u30f4]|[\u3041-\u3094]|\u30fc)+$/.test(command) && !/\u3090|\u3091/.test(command)){
      history[history.cur].str = convertHiragana(command);
      pushEnterKey();
    } else{
      makePopupWindow(`"${command}"はひらがな及びカタカナ以外の文字を含んでいます。`);
    }
  }

  /**
   * flip ship-name history
   */
  function flipCharacters(){
    history.forEach((hist, index)=>{
      const target = document.querySelector(`div.history:nth-child(${index + 1})`);
      const chars = hist.str.split('');
      Array.from(target.children).forEach((charbox, index)=>{
        charbox.dataset.beforeInput = chars[index] ?? '';
        charbox.classList.remove('wrong', 'exist', 'true');
        if(hist.result[index]) charbox.classList.add(hist.result[index]);
      });
    });
  }

  /**
   * set used character highlights
   */
  function usedCharacterHighlights(){
    /**
     * @type { { [char: string]: 'wrong'|'exist'|'true' } }
     */
    let used = {};

    history.forEach((hist)=>{
      hist.str.split('').forEach((char, index)=>{
        used[char] = compResult(hist.result[index], used[char]);
      });
    });

    // remove
    document.querySelectorAll('#default-keyboard > div').forEach(elm=>elm.classList.remove('wrong', 'exist', 'true'));
    document.querySelectorAll('#special-keyboard > div').forEach(elm=>elm.classList.remove('wrong', 'exist', 'true'));

    keys.default.split('').forEach((char, index)=>{
      if(char == ' ' || !Object.keys(used).includes(char)) return;
      const target = document.querySelector(`#default-keyboard > div:nth-child(${ index + 1 })`);
      target.classList.add(used[char]);
    });
    keys.special.split('').forEach((char, index)=>{
      if(char == ' ' || !Object.keys(used).includes(char)) return;
      const target = document.querySelector(`#special-keyboard > div:nth-child(${ index + 1 })`);
      target.classList.add(used[char]);
    });
  }

  /**
   * compaire results and return stronger one
   * wrong < exist < true
   * @param { 'wrong'|'exist'|'true' } res1 result 1
   * @param { 'wrong'|'exist'|'true' } res2 result 2
   * @return { 'wrong'|'exist'|'true'|null }
   */
  function compResult(res1, res2){
    res1 = res1 == 'wrong' ? 1 : res1 == 'exist' ? 2 : res1 == 'true' ? 3 : 0;
    res2 = res2 == 'wrong' ? 1 : res2 == 'exist' ? 2 : res2 == 'true' ? 3 : 0;
    return (res1 > res2 ? res1 : res2) == 1 ? 'wrong' : (res1 > res2 ? res1 : res2) == 2 ? 'exist' : (res1 > res2 ? res1 : res2) == 3 ? 'true' : null;
  }

  /**
   * check exist ship-name
   * @param { string } target
   * @return { boolean } is target in ship-name list
   */
  function isShipName(target){
    return ShipList.map(v=>v.chars).includes(target);
  }

  /**
   * check target is answer, and make result array
   * @param { string } target
   * @return { ('wrong'|'exist'|'true'|null)[] }
   */
  function checkShipName(target){
    const result = [null, null, null, null, null, null, null];
    const ans = answer.chars;
    const count = new Count(answer.chars.split(''));

    // true
    for(const index in result){
      if(!target[index] || !ans[index]) continue;
      if(target[index] == ans[index]){
        count.remove(target[index]);
        result[index] = 'true';
      }
    }

    // exist
    for(const index in result){
      if(!target[index]) continue;
      if(result[index]) continue;
      // console.log(`[${count.get().map(v=>`'${v}'`).join(', ')}].have('${target[index]}')`, '=>', count.have(target[index]));
      if(count.have(target[index])){
        count.remove(target[index]);
        result[index] = 'exist';
        continue;
      }
      result[index] = 'wrong';
    }
    
    return result;
  }
  
  /**
   * start new game (init history)
   */
  function startNewGame(){
    history = [
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
    ];
    history.cur = 0;
    answer = ShipList[Math.floor(Math.random() * ShipList.length)];
    // console.log('answer:', answer); // debug
    flipCharacters();
    usedCharacterHighlights();
  }

  /**
   * display result window
   * @type { 'Surrender' | 'Clear' | 'GameOver' }
   */
  function displayResult(type){
    document.querySelector('div#game-result-window > div[data-ident="type"]').dataset.beforeInput = type;
    document.querySelector('div#game-result-window > div[data-ident="result"]').innerText = answer.chars;
    document.querySelector('div#game-result-window > div[data-ident="info"] > span[data-ident="ship-type"]').dataset.beforeInput = answer.type;
    document.querySelector('div#game-result-window > div[data-ident="info"] > span[data-ident="ship-class"]').dataset.beforeInput = answer.class;
    document.querySelector('div#game-result-window > div[data-ident="info"] > span[data-ident="ship-name"]').dataset.beforeInput = answer.name;
    document.querySelector('div#game-result').classList.add('display');
  }

  /**
   * make popup question window
   * @param { string } message
   * @param { string[] } choices
   * @param { (selected: 1 | 2 | 3)=>void } callback
   */
  function makePopupQuestion(message, choices, callback){
    if(!choices.length) return;
    choices = choices.slice(0, 3);
    /**
     * @type { string | null }
     */
    const type = choices.length == 1 ? 'single' : choices.length == 2 ? 'double' : choices.length == 3 ? 'triple' : null;
    if(!type) return;
    document.querySelector('div#popup-window-buttons').classList.remove('single', 'double', 'triple');
    document.querySelector('div#popup-window-buttons').classList.add(type);
    document.querySelector('div#popup-window').dataset.beforeInput = message;
    const btnNumCallback = [()=>btnCallback(1), ()=>btnCallback(2), ()=>btnCallback(3)];
    /**
     * button onclick callback function
     * @param { 1 | 2 | 3 } selected 
     */
    const btnCallback = (selected)=>{
      document.querySelector('div#popup').classList.remove('display');
      document.querySelector('div#popup-window').dataset.beforeInput = document.querySelector('div#popup-window').dataset.default;
      document.querySelectorAll('div#popup-window-buttons > span').forEach((element, index)=>{
        element.removeEventListener('click', btnNumCallback[index]);
        element.dataset.beforeInput = element.dataset.default;
      });
      callback(selected);
    };
    document.querySelectorAll('div#popup-window-buttons > span').forEach((element, index)=>{
      element.addEventListener('click', btnNumCallback[index]);
      if(choices[index]){
        element.dataset.beforeInput = choices[index];
      }
    });
    document.querySelector('div#popup').classList.add('display');
  }

  /**
   * make popup window
   * @param { string } message
   */
  function makePopupWindow(message){
    document.querySelector('div#popup-window-buttons').classList.remove('single', 'double', 'triple');
    document.querySelector('div#popup-window').dataset.beforeInput = message;
    const callback = ()=>{
      document.querySelector('div#popup').classList.remove('display');
      document.querySelector('div#popup-window').dataset.beforeInput = document.querySelector('div#popup-window').dataset.default;
      document.querySelector('div#popup').removeEventListener('click', callback);
    };
    document.querySelector('div#popup').addEventListener('click', callback);
    document.querySelector('div#popup').classList.add('display');
  }
  
  /**
   * convert hiragana to katakana
   * @param { string } string
   */
  function convertHiragana(string){
    return string.replace(/[\u3041-\u3096]/g, (match)=>String.fromCharCode((match.charCodeAt(0) + 0x60)));
  }

  /**
   * class Count
   */
  class Count{
  
    /**
     * @type { Map<string, number> }
     */
    #field;
  
    /**
     * @param { string[] } targetArray
     */
    constructor(targetArray){
      this.#field = new Map();
      if(targetArray instanceof Array) targetArray.forEach((target)=>this.add(target));
    }
  
    /**
     * get amount(count) of target
     * @param { string } target
     */
    amount(target){
      return this.#field.get(target) ?? 0;
    }
  
    /**
     * does list have target
     * @param { string } target
     * @returns { boolean }
     */
    have(target){
      return this.#field.get(target) ? true : false;
    }
  
    /**
     * add target to list
     * @param { string } target 
     */
    add(target){
      this.#field.set(target, (this.#field.get(target) ?? 0) + 1);
    }
  
    /**
     * remove 1 target
     * @param { string } target 
     * @returns { boolean } if target is not exist, return false.
     */
    remove(target){
      let now = this.#field.get(target) ?? 0;
      if(now == 0) return false;
      if(now == 1) this.#field.delete(target);
      else this.#field.set(target, now - 1);
      return true;
    }
  
    /**
     * get amounts as array
     * @returns { string[] }
     */
    get(){
      return Array.from(this.#field.keys()).map((key)=>new Array(this.#field.get(key)).fill(key)).flat().sort();
    }
  }

  startNewGame();
});
