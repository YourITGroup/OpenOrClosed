using Umbraco.Cms.Core.PropertyEditors;

namespace OpenOrClosed.PropertyEditors;

[DataEditor(
    EditorAlias,
    ValueType = ValueTypes.Json,
    ValueEditorIsReusable = true)]
public class SpecialHoursPropertyEditor(IDataValueEditorFactory dataValueEditorFactory) : DataEditor(dataValueEditorFactory)
{
    internal const string EditorAlias = "OpenOrClosed.SpecialHours";
}
