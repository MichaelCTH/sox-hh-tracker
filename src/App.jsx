import { useEffect, useCallback, useRef, Fragment, useState } from 'react'
import { Card, Image, FloatButton } from 'antd'
import { SettingOutlined, ReloadOutlined, PrinterOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

import './App.css'
import DM from './DM'
import iconIceCream from './assets/ice-cream.png'
import iconLaughing from './assets/laughing.png'
import iconSad from './assets/sad.png'

const REACTION_DELAY_TIME = 2000

function App() {
  let [icon, setIcon] = useState(iconIceCream)
  let [title, setTitle] = useState('Welcome to SOX Happy Hour')
  let [subtitle, setSubtitle] = useState('Please scan your Employee Card')

  let scannedNumber = useRef('')
  let dataManager = useRef(null)

  const { Title } = Typography

  useEffect(() => {
    var setVanta = () => {
      if (window.VANTA)
        window.VANTA.NET({
          el: 'body',
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: window.innerHeight,
          scale: 1.0,
          scaleMobile: 1.0
        })
    }
    setVanta()
    dataManager.current = new DM()
  }, [])

  const resetState = useCallback(() => {
    setIcon(iconIceCream)
    setTitle('Welcome to SOX Happy Hour')
    setSubtitle('Please scan your Employee Card')
  }, [])

  const handleScan = useCallback(
    (scannedNumber) => {
      if (dataManager.current.isUserLogged(scannedNumber.current)) {
        setIcon(iconSad)
        setTitle('You have already checked in')
        setSubtitle('Please join us for the next Happy Hour')
        setTimeout(resetState, REACTION_DELAY_TIME)
      } else {
        dataManager.current.logUser(scannedNumber.current)
        setIcon(iconLaughing)
        setTitle('Enjoy your ice cream!')
        setSubtitle('Please choose your favorite flavor')
        setTimeout(resetState, REACTION_DELAY_TIME)
      }

      scannedNumber.current = ''
    },
    [dataManager, resetState]
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && scannedNumber.current.length > 0) {
        handleScan(scannedNumber)
      } else if (!isNaN(event.key)) {
        scannedNumber.current = scannedNumber.current + event.key
      }
    },
    [handleScan]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const handleResetClick = useCallback(() => {
    confirm('Are you sure you want to reset the name list?') && dataManager.current.emptyData()
  }, [])

  const handleExportToCSV = useCallback(() => {
    if (dataManager.current.getData().size === 0) {
      alert('Sorry, the name list is empty.')
      return
    }
    // Convert dataArray to CSV content
    let csvContent = 'data:text/csv;charset=utf-8,'

    dataManager.current.getData().forEach(function (rowArray) {
      csvContent += rowArray + '\r\n'
    })

    // Create a link element, set its href attribute, and click it programmatically
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'name-list.csv')
    document.body.appendChild(link) // Required for Firefox
    link.click()

    setTimeout(() => {
      document.body.removeChild(link) // Clean up the DOM after link has been clicked
    }, 0)
  }, [])

  return (
    <Fragment>
      <p
        style={{
          color: 'white',
          backgroundColor: 'gray',
          padding: '8px 16px',
          position: 'fixed',
          top: 15,
          borderRadius: 6
        }}
      >
        My friend asked if I wanted to go to happy hour. I said,
        <code>&nbsp;WINE NOT?</code>
      </p>
      <Card style={{ width: 500, height: 500, padding: 25 }}>
        <Image width={300} src={icon} preview={false} />
        <Title level={3}>{title}</Title>
        <Title level={5}>{subtitle}</Title>
      </Card>

      <FloatButton.Group trigger='hover' type='primary' style={{ right: 24 }} icon={<SettingOutlined />}>
        <FloatButton icon={<ReloadOutlined />} onClick={handleResetClick} />
        <FloatButton icon={<PrinterOutlined />} onClick={handleExportToCSV} />
      </FloatButton.Group>
    </Fragment>
  )
}

export default App
