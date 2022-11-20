using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using UmbConstants = Umbraco.Cms.Core.Constants;

namespace OpenOrClosed.Core.PropertyEditors
{
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
        
        private readonly IIOHelper _ioHelper;
        public StandardHoursPropertyEditor(IIOHelper ioHelper, IDataValueEditorFactory dataValueEditorFactory, EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new StandardHoursConfigurationEditor(_ioHelper);
    }
}
