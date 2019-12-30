import React, { Component } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import { stateToHTML } from 'draft-js-export-html';
import addLinkPlugin from './plugins/addLinkPlugin';
import './editor.css';

class RhEditor extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      editorText: '',
      focused: false,
      anchorInput: false
    };
    this.plugins = [addLinkPlugin];
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.onOpenLink = this.onOpenLink.bind(this);
    this.onAddLink = this.onAddLink.bind(this);
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

    if (this.props.recieveContent) {
      this.props.recieveContent(convertedText);
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

  onOpenLink() {
    const {
      anchorInput
    } = this.state;
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    this.setState({
      selection: selection,
      anchorInput: !anchorInput
    });
  }

  onAddLink(link) {
    const {
      selection
    } = this.state;

    if (link.length > 0) {
      const editorState = this.state.editorState;
      const content = editorState.getCurrentContent();
      const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
        url: link
      });
      const newEditorState = EditorState.push(editorState, contentWithEntity, "create-entity");
      const entityKey = contentWithEntity.getLastCreatedEntityKey();
      this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
      this.setState({
        anchorInput: false,
        selection: null
      });
      return "handled";
    }
  }

  render() {
    const {
      editorState,
      anchorInput
    } = this.state;
    return React.createElement("div", {
      className: "wrapper"
    }, React.createElement(EditorControls, {
      active: this.state.focused,
      editorState: editorState,
      onToggle: this.toggleInlineStyle,
      onToggleBlockType: this.toggleBlockType,
      AddLink: this.onOpenLink
    }), anchorInput ? React.createElement(LinkEditor, {
      addAnchor: this.onAddLink
    }) : '', React.createElement(Editor, {
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
const MEDIA_BUTTONS = [{
  label: 'Anchor',
  style: 'ANCHOR'
}];

const EditorControls = props => {
  const {
    editorState
  } = props;
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
  })), MEDIA_BUTTONS.map(type => React.createElement(EditorButton, {
    key: type.label,
    label: type.label,
    onToggle: props.AddLink
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

class LinkEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.props.addAnchor) {
      this.props.addAnchor(this.state.anchor);
    }

    this.setState({
      anchor: ''
    });
  }

  onChange(e) {
    this.setState({
      anchor: e.target.value
    });
  }

  render() {
    return React.createElement("form", {
      className: "anchorContainer",
      onSubmit: this.onSubmit
    }, React.createElement("input", {
      className: "anchorInput",
      type: "text",
      placeholder: "please enter url",
      onChange: this.onChange,
      value: this.state.anchor
    }), React.createElement("div", {
      className: "anchorButtonAppend"
    }, React.createElement("button", {
      type: "submit"
    }, "Add Link")));
  }

}