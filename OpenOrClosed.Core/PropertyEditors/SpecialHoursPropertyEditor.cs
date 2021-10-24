#if NET5_0_OR_GREATER
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using UmbConstants = Umbraco.Cms.Core.Constants;
#else
using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;
using UmbConstants = Umbraco.Core.Constants;
#endif
namespace OpenOrClosed.Core.PropertyEditors
{
    [DataEditor(
        alias: Constants.PropertyEditors.Aliases.SpecialHours,
        name: "Special Business Hours",
        view: "~/App_Plugins/OpenOrClosed/views/specialHours.html",
        Group = UmbConstants.PropertyEditors.Groups.RichContent,
        Icon = Constants.Icons.Time,
        ValueType = ValueTypes.Json)]
    public class SpecialHoursPropertyEditor : DataEditor
    {

#if NET5_0_OR_GREATER

        private readonly IIOHelper _ioHelper;
        public SpecialHoursPropertyEditor(IIOHelper ioHelper, IDataValueEditorFactory dataValueEditorFactory, EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SpecialHoursConfigurationEditor(_ioHelper);
#else
        public SpecialHoursPropertyEditor(ILogger logger) : base(logger)
        {
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SpecialHoursConfigurationEditor();
#endif
    }
}
