import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import './editor.scss';

class RhEditor extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      editorText: '',
      focused: false
    };
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
  }

  componentDidMount() {
    if (this.props.showControls) {
      this.setState({
        focused: true
      });
    }
  }

  toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  onChange(editorState) {
    const convertedText = stateToHTML(editorState.getCurrentContent());
    this.setState({
      editorState: editorState,
      editorText: convertedText
    });

    if (this.props.changeEditor) {
      this.props.changeEditor(convertedText);
    }
  }

  toggleActive() {
    const {
      focused
    } = this.state;

    if (!this.props.showControls) {
      this.setState({
        focused: !focused
      });
    }
  }

  render() {
    const {
      editorState
    } = this.state;
    return React.createElement("div", {
      className: "wrapper"
    }, React.createElement(EditorControls, {
      active: this.state.focused,
      editorState: editorState,
      onToggle: this.toggleInlineStyle,
      onToggleBlockType: this.toggleBlockType
    }), React.createElement(Editor, {
      editorState: editorState,
      placeholder: this.props.placeholder ? this.props.placeholder : 'Add Text Here',
      spellCheck: true,
      onChange: this.onChange,
      onFocus: this.toggleActive,
      onBlur: this.toggleActive
    }));
  }

}

export default RhEditor;

class EditorButton extends Component {
  constructor() {
    super();
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(e) {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  }

  render() {
    let className = 'editorButton';

    if (this.props.active) {
      className += ' editorButtonActive';
    }

    return React.createElement("span", {
      className: className,
      onMouseDown: this.onToggle
    }, this.props.label);
  }

}

const INLINE_STYLES = [{
  label: 'Bold',
  style: 'BOLD'
}, {
  label: 'Italic',
  style: 'ITALIC'
}, {
  label: 'Underline',
  style: 'UNDERLINE'
}];

const EditorControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  const selection = props.editorState.getSelection();
  const blockType = props.editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  return React.createElement("div", {
    className: `editorControls ${props.active ? 'open' : ''}`
  }, INLINE_STYLES.map(type => React.createElement(EditorButton, {
    key: type.label,
    active: currentStyle.has(type.style),
    label: type.label,
    onToggle: props.onToggle,
    style: type.style
  })), React.createElement("br", null), BLOCK_TYPES.map(type => React.createElement(EditorButton, {
    key: type.label,
    active: type.style === blockType,
    label: type.label,
    onToggle: props.onToggleBlockType,
    style: type.style
  })));
};

const BLOCK_TYPES = [{
  label: 'H1',
  style: 'header-one'
}, {
  label: 'H2',
  style: 'header-two'
}, {
  label: 'H3',
  style: 'header-three'
}, {
  label: 'H4',
  style: 'header-four'
}, {
  label: 'H5',
  style: 'header-five'
}, {
  label: 'H6',
  style: 'header-six'
}, {
  label: 'UL',
  style: 'unordered-list-item'
}, {
  label: 'OL',
  style: 'ordered-list-item'
}];