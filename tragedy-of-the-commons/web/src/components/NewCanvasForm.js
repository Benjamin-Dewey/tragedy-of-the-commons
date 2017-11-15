import React from 'react';
import TextInput from './TextInput';
import BlackButton from './BlackButton';

export default class NewCanvasForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formColor: 'white', showPasswordInput: false };
  }

  complain() {
    this.setState(prevState => {
      setTimeout(() => this.setState(prevState => ({ ...prevState, formColor: 'white' })), 500);
      return { ...prevState, formColor: 'red' }
    })
  }

  onClickButton() {
    const title = this.form.elements.title.value;
    const password = this.form.elements.password ? this.form.elements.password.value : null;

    if (title === '' || password === '') {
      this.complain();
    } else {
      this.props.socket.emit('create', { title, password }, success => {
        if (!success) {
          this.complain();
        } else {
          this.props.onCreate();
        }
      });
    }
  }

  onClickPublicRadio() {
    this.setState(prevState => ({ ...prevState, showPasswordInput: false }))
  }

  onClickPrivateRadio() {
    this.setState(prevState => ({ ...prevState, showPasswordInput: true }))
  }

  renderPasswordInputOrNull() {
    const { inputWidth, inputHeight } = this.props;
    return this.state.showPasswordInput ? (
      <TextInput type={'password'} label={'Password'} name={'password'}
        style={{
          width: inputWidth,
          height: inputHeight
        }}
      />
    ) : null;
  }

  render() {
    const { className, inputWidth, inputHeight, onClose } = this.props;
    const showPasswordInput = this.state.showPasswordInput;
    const backgroundColor = this.state.formColor;
    return (
      <div style={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <form
          ref={ref => this.form = ref}
          method={'post'}
          className={className}
          style={{ backgroundColor }}
          onSubmit={e => e.preventDefault()}
        >
          <BlackButton onClick={onClose} text={'Close'} />
          <TextInput label={'Title'} name={'title'}
            style={{
              width: inputWidth,
              height: inputHeight
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <label>Public</label>
            <input
              checked={!showPasswordInput}
              type="radio" name="access"
              value="public"
              onClick={this.onClickPublicRadio.bind(this)}
            />
            <label>Private</label>
            <input
              checked={showPasswordInput}
              type="radio"
              name="access"
              value="private"
              onClick={this.onClickPrivateRadio.bind(this)}
            />
          </div>
          {this.renderPasswordInputOrNull()}
          <BlackButton onClick={this.onClickButton.bind(this)} text={'Create'} width={200} height={40} />
        </form>
      </div>
    );
  }
}
