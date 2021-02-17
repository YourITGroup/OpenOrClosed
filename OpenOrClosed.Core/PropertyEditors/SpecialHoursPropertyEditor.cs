using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyEditors
{
    [DataEditor(
        alias: Constants.PropertyEditors.Aliases.SpecialHours,
        name: "Special Business Hours",
        view: "~/App_Plugins/OpenOrClosed/views/specialHours.html",
        Group = Umbraco.Core.Constants.PropertyEditors.Groups.RichContent,
        Icon = Constants.Icons.Time,
        ValueType = ValueTypes.Json)]
    public class SpecialHoursPropertyEditor : DataEditor
    {
        public SpecialHoursPropertyEditor(ILogger logger) : base(logger)
        {
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SpecialHoursConfigurationEditor();

    }
}
