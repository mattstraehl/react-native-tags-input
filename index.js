import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewPropTypes
} from 'react-native';

import { TextField } from '@ubaids/react-native-material-textfield'

class Tags extends React.Component {

  renderLeftElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.leftElement, style])}>
      {element}
      </View>
  )
  };

  renderRightElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.rightElement, style])}>
      {element}
      </View>
  )
  };

  // If characters remain in the input field after input is completed, add them to the tag.
  onEndEditing = (tags, updateState) => {
    if (tags.tag) {
      const tempArray = tags.tagsArray.concat(tags.tag);
      const tempObject = {
        tag: '',
        tagsArray: [...new Set(tempArray)] // Deduplication
      };
      updateState(tempObject);
      return this.props.input.current.setValue('');
    }
  }

  onChangeText = (text, tags, updateState, keysForTags, keysForTagsArray) => {
    if (keysForTagsArray) {
      return this.onChangeText2(text, tags, updateState, keysForTagsArray)
    }

    let keysStr;
    if (typeof keysForTags === 'string') {
      keysStr = keysForTags;
    } else {
      keysStr = ' ';
    }

    if (text.includes(keysStr)) {
      if (text === keysStr) {
        return
      }
      let tempTag = text.replace(keysStr, '');
      const tempArray = tags.tagsArray.concat(tempTag);
      let tempObject = {
        tag: '',
        tagsArray: [...new Set(tempArray)] // Deduplication
      };
      updateState(tempObject);
      return this.props.input.current.setValue('');
    }
    let tempObject = {
      tag: text,
      tagsArray: tags.tagsArray
    };
    return updateState(tempObject)
  };

  onChangeText2 = (text, tags, updateState, keysForTagsArray) => {

    // Escaping special characters.
    const keys = keysForTagsArray.map((str) => (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"));

    const regexp = new RegExp(keys.join('|'));

    if (regexp.test(text)) {
      if (keysForTagsArray.includes(text)) {
        // The following processing is required because multiple characters may be specified as one delimiter.
        let tempObject = {
          tag: '',
          tagsArray: tags.tagsArray,
        };
        updateState(tempObject);
        return this.props.input.current.setValue('');
      }
      const tempTag = text.replace(regexp, '');
      const tempArray = tags.tagsArray.concat(tempTag);
      let tempObject = {
        tag: '',
        tagsArray: [...new Set(tempArray)] // Deduplication
      };
      updateState(tempObject);
      return this.props.input.current.setValue('');
    }
    let tempObject = {
      tag: text,
      tagsArray: tags.tagsArray
    };
    return updateState(tempObject)
  };

  deleteTag = (tagToDelete, tags, updateState) => {

    let tempArray = tags.tagsArray;
    tempArray.splice(tagToDelete, 1);

    let tempObject = {
      tag: tags.tag,
      tagsArray: tempArray
    };
    updateState(tempObject)
  };

  render() {
    const {
      containerStyle,
      input,
      tags,
      tagStyle,
      tagTextStyle,
      tagsViewStyle,
      updateState,
      keysForTag,
      keysForTagsArray,
      deleteElement,
      deleteIconStyles,
    } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <TextField
          ref={input}
          value={tags.tag}
          onChangeText={text => this.onChangeText(text, tags, updateState, keysForTag, keysForTagsArray)}
          onEndEditing={() => this.onEndEditing(tags, updateState)}
          {...this.props}
        />
        <View style={StyleSheet.flatten([styles.tagsView, tagsViewStyle])}>
          {tags.tagsArray.map((item, count) => {
            return (
              <View
                style={StyleSheet.flatten([styles.tag, tagStyle])}
                key={count}
              >
              <Text style={StyleSheet.flatten([styles.tagText, tagTextStyle])}>{item}</Text>
                <TouchableOpacity onPressIn={() => this.deleteTag(count, tags, updateState) }>
                  {deleteElement ? deleteElement : (
                    <Image
                      source={require('./assets/close.png')}
                      style={StyleSheet.flatten([styles.deleteIcon, deleteIconStyles])}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      </View>
    );
  }
}

Tags.propTypes = {
  input: PropTypes.shape({ current: PropTypes.any }),
  disabled: PropTypes.bool,
  leftElement: PropTypes.element,
  rightElement: PropTypes.element,
  customElement: PropTypes.element,
  label: PropTypes.string,
  tags: PropTypes.object,
  updateState: PropTypes.func,
  keysForTag: PropTypes.string,
  keysForTagsArray: PropTypes.arrayOf(PropTypes.string),
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  inputStyle: TextInput.propTypes.style,
  disabledInputStyle: ViewPropTypes.style,
  leftElementContainerStyle: ViewPropTypes.style,
  rightElementContainerStyle: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
  deleteIconStyles: ViewPropTypes.style,
};

const styles = {
  container: {
    width: '100%',
  },
  disabledInput: {
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  leftElement: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightElement: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    color: 'black',
    fontSize: 18,
    flex: 1,
    minHeight: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  tagsView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    height: 26,
    borderRadius: 13,
    backgroundColor: '#979797',
    minWidth: 40,
    maxWidth: 200,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderWidth: 0.5,
    borderColor: 'gray'
  },
  tagText: {
    marginHorizontal: 5
  },
  labelStyle: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: -4
  },
  deleteIcon: {
    width: 20,
    height: 20,
    opacity: 0.5,
    marginLeft: 5
  }
};

export default Tags;
