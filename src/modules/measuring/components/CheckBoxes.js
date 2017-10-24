import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { PRIMARY_COLOR } from '../../../constants'

// TODO(jan): This should be extracted into a separate package, refactor then
export function CheckBoxes({
  style,
  onButtonPress = () => {},
  labels,
  selectedIndices = [],
  isEnabled = true,
}) {
  const checkBoxes = labels.map((title, i) => (
    <View style={style} key={title}>
      <TouchableOpacity
        onPress={() => onButtonPress(i, title, !~selectedIndices.indexOf(i))}
        style={[
          styles.checkBox,
          isEnabled && !!~selectedIndices.indexOf(i) && styles.checkBoxSelected,
        ]}
        disabled={!isEnabled}
      >
        <Text
          style={[
            styles.checkBoxText,
            isEnabled &&
              !!~selectedIndices.indexOf(i) &&
              styles.checkBoxTextSelected,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  ))

  return (
    <View
      style={[
        styles.checkBoxesContainer,
        isEnabled && styles.checkBoxesContainerSelected,
      ]}
    >
      {checkBoxes}
    </View>
  )
}

const styles = {
  checkBoxesContainer: {
    flex: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
  },
  checkBoxesContainerSelected: {
    opacity: 1,
  },
  checkBox: {
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 10,
    padding: 10,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'dashed',
  },
  checkBoxSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    borderStyle: 'solid',
  },
  checkBoxText: {
    justifyContent: 'center',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  checkBoxTextSelected: {
    color: 'white',
  },
  checkBoxSeparator: {
    flex: -1,
    height: 1,
    backgroundColor: '#ccc',
  },
}
