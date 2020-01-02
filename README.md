## React JS Custom Editor

Custom React JS wysiwyg editor.  

### Current Features
- Bold, Italic, Underline
- Headings 1 - 6
- Order & Unordered Lists

I plan on adding in more features as I go.  
If you would like to see a new feature added, get in contact and I will do my best to add it.

### Install
Via package Manager
```bash
    npm install rh-editor --save
    #or
    yarn add rh-editor
```

### How to use
```js
    import  RhEditor  from 'rh-editor'

    const handleRecieveContent = (value) => {
        console.log(value);
    }

    const handleRecieveEditorState = (state) = {
        console.log(state);
    }

    <RhEditor
        showControls
        startingBlocks={json formated blocks}
        recieveHtml={handleRecieveHtml}
        recieveEditorState={handleRecieveEditorState}
    />
```
