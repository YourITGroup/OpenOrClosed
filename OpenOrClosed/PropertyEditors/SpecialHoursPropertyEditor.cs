using OpenOrClosed.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.PropertyEditors
{
    [DataEditor(
        Constants.PropertyEditors.Aliases.SpecialHours,
        EditorType.PropertyValue,
        "Special Hours",
        "~/App_Plugins/OpenOrClosed/views/specialHours.html",
        Group = Umbraco.Core.Constants.PropertyEditors.Groups.RichContent,
        Icon = Constants.Icons.Time,
        ValueType = ValueTypes.Json)]
    public class SpecialHoursPropertyEditor : DataEditor
    {
        public SpecialHoursPropertyEditor(ILogger logger, EditorType type = EditorType.PropertyValue) : base(logger, type)
        {
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SpecialHoursConfigurationEditor();

    }
}
