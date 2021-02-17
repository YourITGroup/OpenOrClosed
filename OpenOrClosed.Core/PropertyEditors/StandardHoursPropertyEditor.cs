using OpenOrClosed.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyEditors
{
    [DataEditor(
        alias: Constants.PropertyEditors.Aliases.StandardHours,
        name: "Standard Business Hours",
        view: "~/App_Plugins/OpenOrClosed/views/standardHours.html",
        Group = Umbraco.Core.Constants.PropertyEditors.Groups.RichContent,
        Icon = Constants.Icons.Time,
        ValueType = ValueTypes.Json)]
    public class StandardHoursPropertyEditor : DataEditor
    {
        public StandardHoursPropertyEditor(ILogger logger) : base(logger)
        {
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new StandardHoursConfigurationEditor();

    }
}
