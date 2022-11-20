using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using UmbConstants = Umbraco.Cms.Core.Constants;
namespace OpenOrClosed.Core.PropertyEditors
{
    [DataEditor(
        alias: SpecialHoursPropertyEditor.EditorAlias,
        name: "Special Business Hours",
        view: "~/App_Plugins/OpenOrClosed/views/specialHours.html",
        Group = UmbConstants.PropertyEditors.Groups.RichContent,
        Icon = Constants.Icons.Time,
        ValueType = ValueTypes.Json)]
    public class SpecialHoursPropertyEditor : DataEditor
    {

        internal const string EditorAlias = "OpenOrClosed.SpecialHours";

        private readonly IIOHelper _ioHelper;
        public SpecialHoursPropertyEditor(IIOHelper ioHelper, IDataValueEditorFactory dataValueEditorFactory, EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SpecialHoursConfigurationEditor(_ioHelper);
    }
}
