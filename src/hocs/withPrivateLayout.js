import useScript from 'src/hooks/useScript'
import useChatWidget from 'src/hooks/useChatWidget'

const withLayout = (WrappedComponent) => {
  const EnhancedComponent = (props) => {
    useChatWidget()

    // TODO: Check if we still need this
    // useScript('//run.louassist.com/v2.5.1-m?id=100420961328')

    return (
      <>
        <WrappedComponent {...props} />
      </>
    )
  }

  return EnhancedComponent
}

export default withLayout
