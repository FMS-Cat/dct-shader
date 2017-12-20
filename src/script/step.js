let step = ( _obj ) => {
  let obj = _obj;
  let count = -1;

  let func = () => {
    count ++;
    if ( typeof obj[ count ] === 'function' ) {
      obj[ count ]( func );
    }
  };
  func();
};

export default step;
