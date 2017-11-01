import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KeepAwake } from 'expo';
import io from 'socket.io-client';
import PixelCanvasScrollView from './components/PixelCanvasScrollView';
import ColorSelector from './components/ColorSelector';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pixelMatrix: [], colorSelectorVisible: false };
  }

  componentDidMount() {
    this.socket = io('http://localhost:3000');
    this.socket.on('pixelMatrix', pixelMatrix => this.setState(() => ({ pixelMatrix })));
  }

  toggleColorSelector() {
    this.setState(prevState => ({
      ...prevState,
      colorSelectorVisible: !prevState.colorSelectorVisible
    }));
  }

  renderLoader() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color={'black'} size={'large'} />
      </View>
    );
  }

  renderTragedy() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <PixelCanvasScrollView
          pixelMatrix={this.state.pixelMatrix}
          socket={this.socket}
          toggleColorSelector={this.toggleColorSelector.bind(this)}
        />
        {this.state.showColorSelector ? <ColorSelector /> : null}
        <KeepAwake />
      </View>
    );
  }

  render() {
    return this.state.pixelMatrix.length > 0 ?
      this.renderTragedy() : this.renderLoader();
  }
}