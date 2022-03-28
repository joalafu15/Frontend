import { useEffect } from 'react'

const useChatWidget = () => {
  useEffect(() => {
    if (document.getElementById('crisp-chat-import') === null) {
      const script = document.createElement('script')
      script.id = 'crisp-chat-import'
      script.innerText = 'window.$crisp=[];window.CRISP_WEBSITE_ID="4d8b20a7-1775-4892-92de-d5d52881181f";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();'
      document.body.appendChild(script)
      return () => {}
    }
  }, [])
}

export default useChatWidget
