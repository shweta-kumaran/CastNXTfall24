import FormBuilderContainer from '../../../../app/javascript/components/Forms/FormBuilder'
import renderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import {FORMBUILDER_PROPS, newFileSchema, newUiSchema} from '../../__mocks__/forms.mock';

const mockSlide = jest.fn();

jest.mock('../../../../app/javascript/components/Forms/Slide', () =>(props) =>{
    mockSlide(props);
    return (<mockSlide props={props}>{props.children}</mockSlide>)
})


jest.mock('@ginkgo-bioworks/react-json-schema-form-builder', () => ({
    FormBuilder: (props) => {
        jest.fn(props)
        return (<mockFormBuilder props={props}>{props.children}</mockFormBuilder>)
    }
}))

test('Form Builder Load.', () => {
    const component = renderer.create(
        <FormBuilderContainer
            schema={FORMBUILDER_PROPS.schema}
            uischema={FORMBUILDER_PROPS.uischema} 
            onSchemaChange={jest.fn()}
            onUISchemaChange={jest.fn()}
            onFormDataChange={jest.fn()}
            formData={FORMBUILDER_PROPS.formData}
        />
    )
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('Form Builder Schema Change.', () => {
    const view = ReactTestUtils.renderIntoDocument(<FormBuilderContainer
        schema={FORMBUILDER_PROPS.schema}
        uischema={FORMBUILDER_PROPS.uischema} 
        onSchemaChange={jest.fn()}
        onUISchemaChange={jest.fn()}
        onFormDataChange={jest.fn()}
        formData={FORMBUILDER_PROPS.formData}
    />);
    view.onFormBuilderChange(FORMBUILDER_PROPS.schema, FORMBUILDER_PROPS.uischema)
})

test('Form Builder File Schema Change.', () => {
    const view = ReactTestUtils.renderIntoDocument(<FormBuilderContainer
        schema={FORMBUILDER_PROPS.schema}
        uischema={FORMBUILDER_PROPS.uischema} 
        onSchemaChange={jest.fn()}
        onUISchemaChange={jest.fn()}
        onFormDataChange={jest.fn()}
        formData={FORMBUILDER_PROPS.formData}
    />);
    view.onFormBuilderChange(JSON.stringify(newFileSchema), JSON.stringify(newUiSchema))
})

  it('handles the removal of a file input', () => {
    const initialProps = {
      schema: JSON.stringify({ properties: { file_image: { type: "string", format: "data-url" } } }),
      uischema: JSON.stringify({ "ui:order": ["file_image"], "file_image": { "ui:widget": "file" } }),
      onSchemaChange: jest.fn(),
      onUISchemaChange: jest.fn(),
      formData: {}
    };
    const component = ReactTestUtils.renderIntoDocument(<FormBuilderContainer {...initialProps} />);
    component.setState({ fileKey: 'image' }); // Simulating previous file input state
  
    const newSchema = JSON.stringify({ properties: {} });
    const newUiSchema = JSON.stringify({ "ui:order": [] });
  
    component.onFormBuilderChange(newSchema, newUiSchema);
  
    expect(component.state.fileKey).toBeFalsy();
    expect(initialProps.onSchemaChange).toHaveBeenCalledWith(JSON.stringify({ properties: {} }));
    expect(initialProps.onUISchemaChange).toHaveBeenCalledWith(JSON.stringify({ "ui:order": [] }));
  });

  