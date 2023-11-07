using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using UmbConstants = Umbraco.Cms.Core.Constants;

namespace OpenOrClosed.Core.PropertyEditors;

[DataEditor(
    alias: StandardHoursPropertyEditor.EditorAlias,
    name: "Standard Business Hours",
    view: "~/App_Plugins/OpenOrClosed/views/standardHours.html",
    Group = UmbConstants.PropertyEditors.Groups.RichContent,
    Icon = Constants.Icons.Time,
    ValueType = ValueTypes.Json)]
public class StandardHoursPropertyEditor : DataEditor
{
    internal const string EditorAlias = "OpenOrClosed.StandardHours";
    
    private readonly IIOHelper ioHelper;
        private readonly IEditorConfigurationParser editorConfigurationParser;

    public StandardHoursPropertyEditor(IIOHelper ioHelper,
                                           IEditorConfigurationParser editorConfigurationParser,
                                           IDataValueEditorFactory dataValueEditorFactory,
                                           EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
    {
        this.ioHelper = ioHelper;
            this.editorConfigurationParser = editorConfigurationParser;
    }

    protected override IConfigurationEditor CreateConfigurationEditor() => 
            new StandardHoursConfigurationEditor(ioHelper, editorConfigurationParser);
}