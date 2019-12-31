import React, { Component } from 'react';
import { EditorState, RichUtils, ContentBlock, genKey, CharacterMetadata, SelectionState, CompositeDecorator, Editor, convertFromRaw, convertToRaw } from 'draft-js';
import { List, Repeat } from 'immutable'
import { stateToHTML } from 'draft-js-export-html';

import './editor.css';


function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} title={url} className="link">
      {props.children}
    </a>
  );
};

const decorators = new CompositeDecorator([
   {
     strategy: findLinkEntities,
     component: Link,
   },
 ]);

class RhEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            editorState: EditorState.createEmpty(),
            editorText: '',
            focused: false,
        }

        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.toggleBlockType = this.toggleBlockType.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        this.onAddLink = this.onAddLink.bind(this);
    }

    componentDidMount(){
        if(this.props.showControls){
            this.setState({
                focused: true
            })
        }
    }

    toggleInlineStyle(inlineStyle){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    toggleBlockType(blockType){
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }

    onChange(editorState){
        const convertedText = stateToHTML(editorState.getCurrentContent());
        // console.log(convertedText);
        this.setState({
            editorState: editorState,
            editorText: convertedText
        });
        if(this.props.recieveContent){
            this.props.recieveContent(convertedText);
        }
    }

    toggleActive(){
        const { focused } = this.state;
        if(!this.props.showControls){
            this.setState({
                focused: !focused
            })
        }
    }


    //Need to remove those
    // onOpenLink(){
    //     const { anchorInput } = this.state;
    //     const editorState = this.state.editorState;
    //     const selection = editorState.getSelection();
    //
    //     this.setState({
    //         selection: selection,
    //         anchorInput: !anchorInput
    //     })
    // }

    onAddLink(link){
        const { editorState } = this.state;
        const selectionState = editorState.getSelection();
      	const contentState = editorState.getCurrentContent();
      	const currentBlock = contentState.getBlockForKey(selectionState.getStartKey());
        const currentBlockKey = currentBlock.getKey();
        const blockMap = contentState.getBlockMap();
        const blocksBefore = blockMap.toSeq().takeUntil((v) => (v === currentBlock));
      	const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === currentBlock)).rest();
      	const newBlockKey = genKey();

        const newBlock = new ContentBlock({
          key: newBlockKey,
          type: 'unstyled',
          text: link,
          characterList: new List(Repeat(CharacterMetadata.create(), link.length)),
        });

        const newBlockMap = blocksBefore.concat(
          [[currentBlockKey, currentBlock], [newBlockKey, newBlock]],
          blocksAfter
        ).toOrderedMap();

        const selection = editorState.getSelection();

        const newContent = contentState.merge({
          blockMap: newBlockMap,
          selectionBefore: selection,
          selectionAfter: selection.merge({
            anchorKey: newBlockKey,
            anchorOffset: 0,
            focusKey: newBlockKey,
            focusOffset: 0,
            isBackward: false,
          }),
        });

    	let newEditorState = EditorState.push(editorState, newContent, 'split-block');

        let newSelection = new SelectionState({
          anchorKey: newBlockKey,
          anchorOffset: 0,
          focusKey: newBlockKey,
          focusOffset: link.length
        });

        newEditorState = EditorState.forceSelection(newEditorState, newSelection);

        const newContentState = newEditorState.getCurrentContent();
        const contentStateWithEntity = newContentState.createEntity(
          'LINK',
          'IMMUTABLE',
          { url: link }
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        newEditorState = EditorState.set(newEditorState, { currentContent: contentStateWithEntity });

        newEditorState = RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);

    	// reset selection
        newSelection = new SelectionState({
          anchorKey: newBlockKey,
          anchorOffset: link.length,
          focusKey: newBlockKey,
          focusOffset: link.length
        });

        newEditorState = EditorState.forceSelection(newEditorState, newSelection);
        // const convertedText = stateToHTML(newEditorState.getCurrentContent());
        // console.log(convertedText);
        const rawDraftContentState = JSON.stringify( convertToRaw(newEditorState.getCurrentContent()) );
        // console.log(rawDraftContentState);

        // const blocksFromHTML = convertFromHTML(convertedText)
        const blocksFromHTML = convertFromRaw(JSON.parse( rawDraftContentState));
        let initial = EditorState.createWithContent(blocksFromHTML, decorators);

        this.onChange(initial);
    }


    render(){
        const { editorState } = this.state;
        return(
            <div className="wrapper">
                <EditorControls
                    active={this.state.focused}
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                    onToggleBlockType={this.toggleBlockType}
                    AddLink={this.onAddLink}
                />
                <Editor
                    editorState={editorState}
                    decorators={decorators}
                    placeholder={this.props.placeholder?this.props.placeholder: 'Add Text Here'}
                    spellCheck={true}
                    onChange={this.onChange}
                    onFocus={this.toggleActive}
                    onBlur={this.toggleActive}
                />
            </div>
        )
    }
}

export default RhEditor;

const EditorControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    const selection = props.editorState.getSelection();
    const blockType = props.editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    return (
        <div className={`editorControls ${props.active? 'open': ''}`}>
            {INLINE_STYLES.map(
                type => <EditorButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
                />
            )}
            {BLOCK_TYPES.map(
                (type) => <EditorButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggleBlockType}
                style={type.style}
                />
            )}
            {MEDIA_BUTTONS.map(
                type => <LinkButton
                    key={type.label}
                    label={type.label}
                    addLink={props.AddLink}
                />
            )}
        </div>
    );
};

const INLINE_STYLES = [
    {
        label: 'B',
        style: 'BOLD'
    }, {
        label: 'I',
        style: 'ITALIC'
    }, {
        label: 'U',
        style: 'UNDERLINE'
    }
];

const BLOCK_TYPES = [
    {
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
    }
];

const MEDIA_BUTTONS = [
    {
        label: 'Link',
        style: 'ANCHOR'
    }
];

class EditorButton extends Component {
    constructor() {
        super();

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(e){
        e.preventDefault();
        this.props.onToggle(this.props.style)
    }

    render() {
        let className = 'editorButton';
        if (this.props.active) {
            className += ' editorButtonActive';
        }
        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

class LinkButton extends Component {
    constructor() {
        super();

        this.state = {
            addingLink: false,
            anchor: '',
        }

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(e){
        e.preventDefault();
        this.setState({
            addingLink: !this.state.addingLink,
            anchor: ''
        })
    }

    setWrapperRef = (node) => {
      this.wrapperRef = node;
    }

    changeAnchor = (e) => {
        this.setState({
            anchor: e.target.value
        })
    }

    addLink = (e) => {
        e.preventDefault();
        const { anchor } = this.state;
        this.setState({
            anchor: '',
            addingLink: false
        });
        this.props.addLink(anchor);
    }

    render() {
        const { addingLink, anchor } = this.state;
        let className = 'editorButton';
        if (this.state.addingLink) {
            className += ' editorButtonActive';
        }
        return (
            <span className={`rhLinkContainer ${className}`}>
                <span onClick={this.onToggle}>{this.props.label}</span>
                   {
                       addingLink &&
                         <div className="tooltip">
                            <div className="tooltipGroup">
                                <input placeholder="Enter URL.." value={anchor} autoFocus onChange={this.changeAnchor}/>
                                <button onClick={this.addLink}>Insert</button>
                            </div>
                         </div>
                   }
            </span>
        );
    }
}
