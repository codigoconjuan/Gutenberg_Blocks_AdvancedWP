const { registerBlockType } = wp.blocks;
const { RichText, MediaUpload, URLInputButton,  BlockControls, AlignmentToolbar } = wp.editor;
const { IconButton } = wp.components;

/** Import the logo */
import { ReactComponent as Logo } from '../ga-logo.svg';

registerBlockType('ga/imagetext', {
    title: 'GA Image with Text', 
    icon: { src: Logo }, 
    category: 'gourmet-artist', 
    attributes: {
        appTitle: {
            source: 'html',
            type:'string',
            selector: '.image-text-block h1'
        }, 
        appText: {
            source: 'html', 
            type: 'string',
            selector: '.image-text-block p'
        }, 
        appImage: {
            type: 'string',
            source: 'attribute',
            attribute: 'src',
            selector: '.image img'
        },
        appURL: {
            type: 'string', 
            source: 'attribute',
            attribute: 'href',
            selector: '.image-text-block a'
        },
        appAligment: {
            type:'string',
            default: 'center'
        }
    }, 
    styles: [
        {
            name: 'default', 
            label: 'Blue (Default)',
            isDefault: true
        }, 
        {
            name: 'green', 
            label: 'Green'
        },
        {
            name: 'pink',
            label: 'Pink'
        }
    ],
    edit: props => {

        // extract the contents from props
        const { attributes: { appTitle, appText, appImage, appURL, appAligment }, setAttributes } = props;

        const onChangeAppTitle = newTitle => {
            setAttributes({ appTitle : newTitle })
        }

        const onChangeAppText = newText => {
            setAttributes({ appText : newText })
        }

        const onSelectAppImage = image => {
            setAttributes({ appImage : image.sizes.full.url });
        }

        const onChangeAppUrl = newURL => {
            setAttributes({ appURL : newURL });
        }

        const onChangeAlignContent = newAligment => {
            setAttributes({ appAligment : newAligment });
        }

        return(
            <div className="image-text-block">
                <BlockControls>
                    <AlignmentToolbar
                        onChange={onChangeAlignContent}
                    />
                </BlockControls>


                <div className="container">
                    <div className="content" style={{ textAlign: appAligment }}>
                        <h1>
                            <RichText 
                                placeholder="Add the Title"
                                onChange={onChangeAppTitle}
                                value={appTitle}
                            />
                        </h1>
                        <p>
                            <RichText
                                placeholder="Add the Description"
                                onChange={onChangeAppText}
                                value={appText}
                            />
                        </p>
                        <a href={appURL} className="button" target="_blank" rel="noopener noreferrer" >Download</a>
                        <URLInputButton
                            onChange={onChangeAppUrl}
                            url={appURL}
                        />
                    </div>
        
                    <div className="image">
                        <img src={appImage} />
                        <MediaUpload 
                            onSelect={onSelectAppImage}
                            type="image"
                            value={appImage}
                            render={({open}) => (
                                <IconButton
                                    onClick={open}
                                    icon='format-image'
                                    showTooltip='true'
                                    label='Add Image'
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        )
    },
    save: props => {

        // extract the contents from props
        const { attributes: { appTitle, appText, appImage, appURL, appAligment } } = props;


        return(
            <div className="image-text-block">
                <div className="container">
                    <div className="content"  style={{ textAlign: appAligment }}>
                        <h1>
                            <RichText.Content value={appTitle} />
                        </h1>
                        <p>
                            <RichText.Content value={appText} />
                        </p>
                        <a href={appURL} className="button" target="_blank" rel="noopener noreferrer" >Download</a>
                    </div>
        
                    <div className="image">
                        <img src={appImage} />
                    </div>
                </div>
            </div>
        )
    }
});
