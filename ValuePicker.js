import React from 'react';
import {
    SafeAreaView,
    Text,
    Animated,
    Dimensions,
    StyleSheet,
    View
} from 'react-native';

const { width } = Dimensions.get('screen');

const minValue = 120;
const segmentsLength = 101;
const segmentWidth = 2;
const segmentSpacing = 20;
const snapSegment = segmentWidth + segmentSpacing;
const spacerWidth = (width - segmentWidth) / 2;
const rulerWidth = spacerWidth * 2 + (segmentsLength - 1) * snapSegment;
const indicatorWidth = 100;
const indicatorHeight = 30;
const data = [...Array(segmentsLength).keys()].map(i => i + minValue);

const Ruler = () => {
    return (
        <View style={styles.ruler}>
            <View style={styles.spacer} />
            {data.map(i => {
                const tenth = i % 10 === 0;
                return (
                    <View
                        key={i}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: tenth ? '#fff' : '#ddd',
                                height: tenth ? 30 : 20,
                                marginRight: i === data.length - 1 ? 0 : segmentSpacing
                            }
                        ]}
                    />
                );
            })}
            <View style={styles.spacer} />
        </View>
    );
};

export default class ValuePicker extends React.Component {
    scrollViewRef = React.createRef();
    textInputRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            indexText: minValue,
            scrollX: new Animated.Value(0),
            initialValue: 25
        };
        this.state.scrollX.addListener(({ value }) => {
            if (this.state.indexText) {
                this.setState({ indexText: `${Math.round(value / snapSegment) + minValue}` })
            }
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Animated.ScrollView
                    ref={this.scrollViewRef}
                    horizontal
                    contentContainerStyle={styles.scrollViewContainerStyle}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    snapToInterval={snapSegment}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: this.state.scrollX }
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                >
                    <Ruler />
                </Animated.ScrollView>
                <View style={styles.indicatorWrapper}>
                    <Text style={styles.ageTextStyle}>{this.state.indexText}</Text>
                    <View style={[styles.segment, styles.segmentIndicator]} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    indicatorWrapper: {
        position: 'absolute',
        left: (width - indicatorWidth) / 2,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: indicatorWidth
    },
    segmentIndicator: {
        height: indicatorHeight,
        backgroundColor: 'white',
        width: 4
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative'
    },
    ruler: {
        backgroundColor: '#051C78',
        width: rulerWidth,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    segment: {
        width: segmentWidth
    },
    scrollViewContainerStyle: {
        justifyContent: 'flex-end'
    },
    ageTextStyle: {
        color: "white",
        fontSize: 30,
        fontFamily: 'Menlo'
    },
    spacer: {
        width: spacerWidth,
        backgroundColor: 'red'
    }
});
