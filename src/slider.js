import React, { Component } from "react"
import "./styles.css"
import WaitingLoader from "dumbComponents/Core/WaitingLoader"
import uuid from "uuid"
import defaultProps from "./defaultProps"
import initialState from "./initialState"

//offset value should not be 0
const OFFSET_VALUE = 130
const THUMBNAIL_FULL_VISIBLE_IMAGES = 6

class ImageCarousel extends Component {
  state = Object.assign({},initialState, defaultProps, this.props)

  handleImageLoaded = () => {
    this.setState({ imageLoading: false })
  }

  handleImageLoading = () => {
    this.setState({ imageLoading: true })
  }

  next = (currentIndex) => {
    this.setState({
      activeIndex: currentIndex + 1,
    })
    this.handleImageLoading()
  }

  prev = (currentIndex) => {
    this.setState({
      activeIndex: currentIndex - 1,
    })
    this.handleImageLoading()
  }

  set = (currentIndex) => {
    this.setState({
      activeIndex: currentIndex,
    })
    this.handleImageLoading()
  }

  thumbNext = (offset) => {
    const newOffset = (offset - OFFSET_VALUE)
    this.setOffset(newOffset)
  }

  thumbPrev = (offset) => {
    const newOffset = (offset + OFFSET_VALUE)
    this.setOffset(newOffset)
  }

  setOffset = (offset) => {
    this.setState({
      offset,
    })
  }

  lock() {
    this.viewportNode.style.overflowY = "hidden"
  }

  unlock() {
    this.viewportNode.style.overflowY = "auto"
    //window.scrollTo(0, this.state.lockPosition)
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress)
  }

  componentDidMount() {
    this.viewportNode = document.querySelector("body")
    this.lock()
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
    this.unlock()
  }

  close = () => {
    this.props.onClose()
  }

  handleKeyPress = (e) => {
    const { activeIndex, fullScreenImageList } = this.state
    if (e.keyCode === ESCAPE_KEY) {
      this.close()
    } else if (e.keyCode === KEY.LEFTARROW && activeIndex > 0) {
      this.showPrevImage()
    } else if (e.keyCode === KEY.RIGHTARROW && activeIndex < fullScreenImageList.length - 1) {
      this.showNextImage()
    }
  }

  showPrevImage = () => {
    const { activeIndex, offset } = this.state
    this.prev(activeIndex)
    if (!this.bringActiveThumbToFocus() && offset < 0) {
      this.thumbPrev(offset)
    }
  }

  showNextImage = () => {
    const { activeIndex, offset } = this.state
    this.next(activeIndex)
    if (!this.bringActiveThumbToFocus() && this.showThumbRightIcon()) {
      this.thumbNext(offset)
    }
  }

  showThumbRightIcon = () => {
    const { activeIndex, offset, fullScreenImageList } = this.state
    const totalImagesCount = fullScreenImageList.length
    return ((-1) * offset < OFFSET_VALUE * (totalImagesCount - THUMBNAIL_FULL_VISIBLE_IMAGES))
      && totalImagesCount > 5 && activeIndex < totalImagesCount
  }

  /*
    This function will be used to bring active image in the focus.
    If the active image is in left part of thumbnail strip, it will stick to left most visible part
    If the active image is in right part of thumbnail strip, it will stick to right most visible part
  */
  bringActiveThumbToFocus = () => {
    const { activeIndex, offset } = this.state
    const offsetIndex = (-1) * offset / OFFSET_VALUE
    if (activeIndex < offsetIndex) {
      /* It means the image is in left invisible part */
      this.setOffset((-1) * activeIndex * OFFSET_VALUE)
      return true
    } else if (activeIndex > (offsetIndex + THUMBNAIL_FULL_VISIBLE_IMAGES)) {
      /* It means the image is in right invisible part */
      const newOffset = (activeIndex - offsetIndex) * OFFSET_VALUE * (-1)
        + offset
        + ((THUMBNAIL_FULL_VISIBLE_IMAGES - 1) * OFFSET_VALUE)
      this.setOffset(newOffset)
      return true
    }
    return false
  }

  render() {
    var settings = Object.assign({},defaultProps, this.props)

    const {
      activeIndex,
      imageLoading,
      offset,
      visible,
      fullScreenImageList,
    } = this.state
    const totalImagesCount = fullScreenImageList.length
    return (
      <div className="imageCarouselContainer">
        <div className="wrapper">
          {
            activeIndex > 0 &&
            <div className="prevIcon" onClick={this.showPrevImage}>
              <i className="gm gm-angle-left"></i>
            </div>
          }
          <div className="imageContainer">
            <img
              src={fullScreenImageList[activeIndex]}
              onLoad={this.handleImageLoaded}
              alt=""
            />
            { imageLoading
              ? <div className="imageLoader"><WaitingLoader label=" " /></div>
              : null
            }
          </div>
          {
            activeIndex < totalImagesCount - 1 &&
            <div className="nextIcon" onClick={this.showNextImage}>
              <i className="gm gm-angle-right"></i>
            </div>
          }
          <div className="clear"></div>
        </div>
        <div className="clear"></div>
      </div>
    )
  }
}

export default (ImageCarousel)
