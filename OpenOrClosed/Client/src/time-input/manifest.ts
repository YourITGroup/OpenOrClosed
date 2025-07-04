export const manifests: Array<UmbExtensionManifest> = [{
    type: 'propertyEditorUi',
    alias: 'OpenOrClosed.PropertyEditorUi.TimeInput',
    name: 'Time Input Property Editor UI',
    element: () => import('./time-input-property-editor.element.js'),
    meta: {
        label: 'Time Input',
        icon: 'icon-time',
        group: 'common',
    },
}];