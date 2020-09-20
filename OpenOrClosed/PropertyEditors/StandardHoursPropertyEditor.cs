using OpenOrClosed.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.PropertyEditors
{
    [DataEditor(
        Constants.PropertyEditors.Aliases.StandardHours,
        EditorType.PropertyValue,
        "Standard Hours",
        "~/App_Plugins/OpenOrClosed/views/standardHours.html",
        Group = Umbraco.Core.Constants.PropertyEditors.Groups.RichContent,
        Icon = Constants.Icons.Time,
        ValueType = ValueTypes.Json)]
    public class StandardHoursPropertyEditor : DataEditor
    {
        public StandardHoursPropertyEditor(ILogger logger, EditorType type = EditorType.PropertyValue) : base(logger, type)
        {
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new StandardHoursConfigurationEditor();

    }
}
