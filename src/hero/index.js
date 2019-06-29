const { registerBlockType } = wp.blocks;
const { RichText, MediaUpload, BlockControls, AlignmentToolbar } = wp.editor;
const { IconButton } = wp.components;

/** Import the logo */
import { ReactComponent as Logo } from '../ga-logo.svg';

registerBlockType('ga/hero', {
    title: 'GA Hero', 
    icon: { src: Logo }, 
    category: 'gourmet-artist', 
    attributes: {
        heroTitle: {
            type: 'string', 
            source: 'html',
            selector: '.hero-block h1'
        }, 
        heroText: {
            type: 'string',
            source: 'html', 
            selector: '.hero-block p'
        }, 
        heroImage: {
            type: 'string'
        }, 
        alignContent: {
            type: 'string', 
            default: 'center'
        }
    },
    supports: {
        align: ['wide', 'full']
    },
    edit: props => {

        // Extract the contents from props
        const { attributes: { heroTitle, heroText, heroImage, alignContent }, setAttributes } = props;

        // Reads the contents from the title
        const onChangeTitle = newTitle => {
            setAttributes({ heroTitle : newTitle });
        }

        // reads the contents from the text box
        const onChangeText = newText => {
            setAttributes({ heroText : newText })
        }

        // Access the Selected image
        const onSelectImage = newImage => {
            setAttributes({ heroImage : newImage.sizes.full.url });
        }

        // access the alignment
        const onChangeAlignment = newAlignment => {
            setAttributes({ alignContent : newAlignment });
        }

        return(
            <div className="hero-block" style={{ backgroundImage : `url(${heroImage})` }}>
                <BlockControls>
                    <AlignmentToolbar
                        onChange={onChangeAlignment}
                    />
                </BlockControls>

                    <MediaUpload
                        onSelect={onSelectImage}
                        type="image"
                        render={({open}) => (
                            <IconButton 
                                onClick={open}
                                icon="format-image"
                                showTooltip="true"
                                label="Add Image"
                            />
                        )}
                    />

                <h1>
                    <RichText 
                        placeholder="Add the Title"
                        onChange={onChangeTitle}
                        value={heroTitle}
                        style={{textAlign: alignContent }}
                    />
                </h1>
                <p>
                    <RichText
                        placeholder="Add the Tagline"
                        onChange={onChangeText}
                        value={heroText}
                        style={{textAlign: alignContent }}
                    />
                </p>
            </div>
        )
    },
    save: props => {

        // Extract the contents from props
        const { attributes: { heroTitle, heroText, heroImage, alignContent } } = props;

        return(
            <div className="hero-block" style={{ backgroundImage : `url(${heroImage})` }}>
                <h1 style={{ textAlign: alignContent }} >
                    <RichText.Content value={heroTitle} />
                </h1>
                <p style={{ textAlign: alignContent }} >
                    <RichText.Content value={heroText} />
                </p>
            </div>
        )
    }
});
