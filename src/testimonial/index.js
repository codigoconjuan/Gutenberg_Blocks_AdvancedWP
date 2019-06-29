const { registerBlockType } = wp.blocks;
const { RichText, MediaUpload, InspectorControls, ColorPalette } = wp.editor;
const { IconButton, PanelBody } = wp.components;

/** Import the logo */
import { ReactComponent as Logo } from '../ga-logo.svg';

registerBlockType('ga/testimonial', {
    title: 'GA Testimonial', 
    icon: { src: Logo }, 
    category: 'gourmet-artist', 
    attributes: {
        testimonialText: {
            type: 'string', 
            source: 'html', 
            selector: '.testimonial-block blockquote'
        }, 
        testimonialName: {
            type: 'string', 
            source: 'html',
            selector: '.testimonial-info p'
        }, 
        testimonialImage: {
            type: 'string', 
            source: 'attribute',
            attribute: 'src',
            selector: '.testimonial-info img'
        }, 
        testimonialColor: {
            type: 'string', 
            default: '#000000'
        }
    }, 
    edit: props => {

        // console.log(props);

        // Extract the contents from attributes
        const { attributes: { testimonialText, testimonialName, testimonialImage, testimonialColor }, setAttributes } = props;

        // Reads the text from the testimonial
        const onChangeTestimonialText = newText => {
            setAttributes({ testimonialText: newText })
        }

        // Reads the name of the person
        const onChangeTestimonialName = personName => {
            setAttributes({ testimonialName : personName })
        }

        // Access the Selected image
        const onSelectImage = newImage => {
            setAttributes({ testimonialImage : newImage.sizes.medium.url });
        }

        // access the HEX value from the color pallete
        const onChangeTestimonialColor = newColor => {
            setAttributes({ testimonialColor : newColor })
        }

        return(
            <>
            <InspectorControls>
                <PanelBody title='Color Options'>
                    <div className="components-base-control">
                        <div className="components-base-control__field">
                            <label className="components-base-control__label">
                                Name person's Color and Line
                            </label>
                            <ColorPalette
                                onChange={onChangeTestimonialColor}
                            />
                        </div>
                    </div>
                </PanelBody>
            </InspectorControls>
            <div className="testimonial-block" style={{ borderColor : testimonialColor }}>
                <blockquote>
                    <RichText 
                        placeholder="Add the Text for the Testimonial"
                        onChange={onChangeTestimonialText}
                        value={testimonialText}
                    />
                </blockquote>
                <div className="testimonial-info">
                    <img src={testimonialImage} />
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
                    <p>
                        <RichText
                            placeholder="Add the Name of the Person"
                            onChange={onChangeTestimonialName}
                            value={testimonialName}
                            style={{ color: testimonialColor }}
                        />
                    </p>
                </div>
            </div>
        </>
        )
    }, 
    save: props => {

        // extract the contents from props
        const { attributes: { testimonialText, testimonialName, testimonialImage, testimonialColor }  } = props;

        return(
            <div className="testimonial-block" style={{ borderColor : testimonialColor }}>
                <blockquote>
                    <RichText.Content value={testimonialText} />
                </blockquote>
                <div className="testimonial-info">
                    <img src={testimonialImage} />
                    <p style={{ color: testimonialColor }}>
                        <RichText.Content value={testimonialName} />
                    </p>
                </div>
            </div>
        )
    }
})