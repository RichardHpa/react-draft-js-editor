(this["webpackJsonprh-editor"]=this["webpackJsonprh-editor"]||[]).push([[0],{188:function(e,t,n){},189:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(19),i=n.n(r),l=n(86),c=(n(92),n(36)),s=n(37),g=n(39),h=n(38),d=n(10),u=n(40),p=n(3),y=n(20),f=n(85);n(188);var v=new p.CompositeDecorator([{strategy:function(e,t,n){e.findEntityRanges((function(e){var t=e.getEntity();return null!==t&&"LINK"===n.getEntity(t).getType()}),t)},component:function(e){var t=e.contentState.getEntity(e.entityKey).getData().url;return o.a.createElement("a",{href:t,title:t,className:"link"},e.children)}}]),b=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(g.a)(this,Object(h.a)(t).call(this,e))).state={editorState:p.EditorState.createEmpty(),editorText:"",focused:!1},n.toggleInlineStyle=n.toggleInlineStyle.bind(Object(d.a)(n)),n.toggleBlockType=n.toggleBlockType.bind(Object(d.a)(n)),n.onChange=n.onChange.bind(Object(d.a)(n)),n.toggleActive=n.toggleActive.bind(Object(d.a)(n)),n.onAddLink=n.onAddLink.bind(Object(d.a)(n)),n}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){if(this.props.showControls&&this.setState({focused:!0}),this.props.startingBlocks){var e=Object(p.convertFromRaw)(JSON.parse(this.props.startingBlocks)),t=p.EditorState.createWithContent(e,v);this.setState({editorState:t})}}},{key:"toggleInlineStyle",value:function(e){this.onChange(p.RichUtils.toggleInlineStyle(this.state.editorState,e))}},{key:"toggleBlockType",value:function(e){this.onChange(p.RichUtils.toggleBlockType(this.state.editorState,e))}},{key:"onChange",value:function(e){var t,n=e.getSelection(),a=n.getAnchorKey(),o=e.getCurrentContent().getBlockForKey(a),r=n.getStartOffset(),i=n.getEndOffset();t=o.getText().slice(r,i).length>0?n:null;var l=Object(f.a)(e.getCurrentContent());if(this.setState({editorState:e,editorText:l,currentSelection:t}),this.props.recieveHtml&&this.props.recieveHtml(l),this.props.recieveEditorState){var c=JSON.stringify(Object(p.convertToRaw)(e.getCurrentContent()));this.props.recieveEditorState(c)}}},{key:"toggleActive",value:function(){var e=this.state.focused;this.props.showControls||this.setState({focused:!e})}},{key:"onAddLink",value:function(e){var t=this.state,n=t.editorState;if(t.currentSelection){var a=n.getCurrentContent().createEntity("LINK","IMMUTABLE",{url:e}),o=p.EditorState.push(n,a,"create-entity"),r=a.getLastCreatedEntityKey();o=p.RichUtils.toggleLink(o,o.getSelection(),r);var i=JSON.stringify(Object(p.convertToRaw)(o.getCurrentContent())),l=Object(p.convertFromRaw)(JSON.parse(i)),c=p.EditorState.createWithContent(l,v);this.onChange(c),this.setState({currentSelection:null})}else{var s=n.getSelection(),g=n.getCurrentContent(),h=g.getBlockForKey(s.getStartKey()),d=h.getKey(),u=g.getBlockMap(),f=u.toSeq().takeUntil((function(e){return e===h})),b=u.toSeq().skipUntil((function(e){return e===h})).rest(),S=Object(p.genKey)(),k=new p.ContentBlock({key:S,type:"unstyled",text:e,characterList:new y.a(Object(y.c)(p.CharacterMetadata.create(),e.length))}),m=f.concat([[d,h],[S,k]],b).toOrderedMap(),O=n.getSelection(),E=g.merge({blockMap:m,selectionBefore:O,selectionAfter:O.merge({anchorKey:S,anchorOffset:0,focusKey:S,focusOffset:0,isBackward:!1})}),C=p.EditorState.push(n,E,"split-block"),L=new p.SelectionState({anchorKey:S,anchorOffset:0,focusKey:S,focusOffset:e.length}),j=(C=p.EditorState.forceSelection(C,L)).getCurrentContent().createEntity("LINK","IMMUTABLE",{url:e}),T=j.getLastCreatedEntityKey();C=p.EditorState.set(C,{currentContent:j}),C=p.RichUtils.toggleLink(C,C.getSelection(),T),L=new p.SelectionState({anchorKey:S,anchorOffset:e.length,focusKey:S,focusOffset:e.length}),C=p.EditorState.forceSelection(C,L);var B=JSON.stringify(Object(p.convertToRaw)(C.getCurrentContent())),w=Object(p.convertFromRaw)(JSON.parse(B)),A=p.EditorState.createWithContent(w,v);this.onChange(A)}}},{key:"render",value:function(){var e=this.state.editorState;return o.a.createElement("div",{className:"wrapper"},o.a.createElement(S,{active:this.state.focused,editorState:e,onToggle:this.toggleInlineStyle,onToggleBlockType:this.toggleBlockType,AddLink:this.onAddLink}),o.a.createElement(p.Editor,{editorState:e,decorators:v,placeholder:this.props.placeholder?this.props.placeholder:"Add Text Here",spellCheck:!0,onChange:this.onChange,onFocus:this.toggleActive,onBlur:this.toggleActive}))}}]),t}(a.Component),S=function(e){var t=e.editorState.getCurrentInlineStyle(),n=e.editorState.getSelection(),a=e.editorState.getCurrentContent().getBlockForKey(n.getStartKey()).getType();return o.a.createElement("div",{className:"editorControls ".concat(e.active?"open":"")},O.map((function(t){return o.a.createElement(C,{key:t.label,label:t.label,addLink:e.AddLink})})),k.map((function(n){return o.a.createElement(E,{key:n.label,active:t.has(n.style),label:n.label,onToggle:e.onToggle,style:n.style})})),m.map((function(t){return o.a.createElement(E,{key:t.label,active:t.style===a,label:t.label,onToggle:e.onToggleBlockType,style:t.style})})))},k=[{label:"B",style:"BOLD"},{label:"I",style:"ITALIC"},{label:"U",style:"UNDERLINE"}],m=[{label:"H1",style:"header-one"},{label:"H2",style:"header-two"},{label:"H3",style:"header-three"},{label:"H4",style:"header-four"},{label:"H5",style:"header-five"},{label:"H6",style:"header-six"},{label:"UL",style:"unordered-list-item"},{label:"OL",style:"ordered-list-item"}],O=[{label:"Link",style:"ANCHOR"}],E=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(g.a)(this,Object(h.a)(t).call(this))).onToggle=e.onToggle.bind(Object(d.a)(e)),e}return Object(u.a)(t,e),Object(s.a)(t,[{key:"onToggle",value:function(e){e.preventDefault(),this.props.onToggle(this.props.style)}},{key:"render",value:function(){var e="editorButton";return this.props.active&&(e+=" editorButtonActive"),o.a.createElement("span",{className:e,onMouseDown:this.onToggle},this.props.label)}}]),t}(a.Component),C=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(g.a)(this,Object(h.a)(t).call(this))).state={addingLink:!1,anchor:""},e.onToggle=e.onToggle.bind(Object(d.a)(e)),e.changeAnchor=e.changeAnchor.bind(Object(d.a)(e)),e.addLink=e.addLink.bind(Object(d.a)(e)),e}return Object(u.a)(t,e),Object(s.a)(t,[{key:"onToggle",value:function(e){e.preventDefault(),this.setState({addingLink:!this.state.addingLink,anchor:""})}},{key:"setWrapperRef",value:function(e){this.wrapperRef=e}},{key:"changeAnchor",value:function(e){this.setState({anchor:e.target.value})}},{key:"addLink",value:function(e){e.preventDefault();var t=this.state.anchor;this.setState({anchor:"",addingLink:!1}),this.props.addLink(t)}},{key:"render",value:function(){var e=this.state,t=e.addingLink,n=e.anchor,a="editorButton";return this.state.addingLink&&(a+=" editorButtonActive"),o.a.createElement("span",{className:"rhLinkContainer ".concat(a)},o.a.createElement("span",{onClick:this.onToggle},this.props.label),t&&o.a.createElement("div",{className:"tooltip"},o.a.createElement("div",{className:"tooltipGroup"},o.a.createElement("input",{placeholder:"Enter URL..",value:n,autoFocus:!0,onChange:this.changeAnchor}),o.a.createElement("button",{onClick:this.addLink},"Insert"))))}}]),t}(a.Component),L=function(){var e=Object(a.useState)("<p>Start typing content here and see the preview.</p>"),t=Object(l.a)(e,2),n=t[0],r=t[1];return o.a.createElement("div",{className:"rhContainer"},o.a.createElement("div",{className:"rhEdit"},o.a.createElement(b,{startingBlocks:'{"blocks":[{"key":"7r7mr","text":"Start typing content here and see the preview.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',showControls:!0,recieveHtml:function(e){r(e)},recieveEditorState:function(e){}})),o.a.createElement("div",{className:"rhOutput"},o.a.createElement("h2",null,"Preview"),o.a.createElement("hr",null),o.a.createElement("div",{dangerouslySetInnerHTML:{__html:n}})))};i.a.render(o.a.createElement(L,null),document.getElementById("root"))},87:function(e,t,n){e.exports=n(189)},92:function(e,t,n){}},[[87,1,2]]]);
//# sourceMappingURL=main.7859751b.chunk.js.map