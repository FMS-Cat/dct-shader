let Tweak = class {
  constructor( _el ) {
    let it = this;

    it.parent = _el;
    it.values = {};
    it.elements = {};
  }

  button( _name, _props ) {
    let it = this;

    let props = _props || {};

    if ( typeof it.values[ _name ] === 'undefined' ) {
      let div = document.createElement( 'div' );
      it.parent.appendChild( div );

      let input = document.createElement( 'input' );
      div.appendChild( input );
      input.type = 'button';
      input.value = _name;

      input.addEventListener( 'click', () => {
        it.values[ _name ] = true;
      } );

      it.elements[ _name ] = {
        div: div,
        input: input
      };
    }

    let tempvalue = it.values[ _name ];
    it.values[ _name ] = false;
    if ( typeof props.set === 'boolean' ) {
      it.values[ _name ] = props.set;
    }

    return tempvalue;
  }

  checkbox( _name, _props ) {
    let it = this;

    let props = _props || {};

    let value;

    if ( typeof it.values[ _name ] === 'undefined' ) {
      value = props.value || false;

      let div = document.createElement( 'div' );
      it.parent.appendChild( div );

      let name = document.createElement( 'span' );
      div.appendChild( name );
      name.innerText = _name;

      let input = document.createElement( 'input' );
      div.appendChild( input );
      input.type = 'checkbox';
      input.checked = value;

      it.elements[ _name ] = {
        div: div,
        name: name,
        input: input
      };
    } else {
      value = it.elements[ _name ].input.checked;
    }

    if ( typeof props.set === 'boolean' ) {
      value = props.set;
    }

    it.elements[ _name ].input.checked = value;
    it.values[ _name ] = value;

    return it.values[ _name ];
  }

  range( _name, _props ) {
    let it = this;

    let props = _props || {};

    let value;

    if ( typeof it.values[ _name ] === 'undefined' ) {
      let min = typeof props.min === "number" ? props.min : 0.0;
      let max = typeof props.max === "number" ? props.max : 1.0;
      let step = typeof props.step === "number" ? props.step : 0.001;
      value = typeof props.value === "number" ? props.value : min;

      let div = document.createElement( 'div' );
      it.parent.appendChild( div );

      let name = document.createElement( 'span' );
      div.appendChild( name );
      name.innerText = _name;

      let input = document.createElement( 'input' );
      div.appendChild( input );
      input.type = 'range';
      input.value = value;
      input.min = min;
      input.max = max;
      input.step = step;

      let val = document.createElement( 'span' );
      val.innerText = value.toFixed( 3 );
      div.appendChild( val );
      input.addEventListener( 'input', ( _event ) => {
        let value = parseFloat( input.value );
        val.innerText = value.toFixed( 3 );
      } );

      it.elements[ _name ] = {
        div: div,
        name: name,
        input: input,
        val: val
      };
    } else {
      value = parseFloat( it.elements[ _name ].input.value );
    }

    if ( typeof props.set === 'number' ) {
      value = props.set;
    }

    it.values[ _name ] = value;
    it.elements[ _name ].input.value = value;

    return it.values[ _name ];
  };
};

export default Tweak;
