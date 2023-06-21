import React from 'react'

// each classname badge-item-stat is a badge
function BadgesContent() {
  return (
    <div>
      <div className="p-8 bg-gray-50 rounded-xl">
  <div className="grid grid-cols-3 gap-4 mt-8 justify-center">
    
    <div className="badge-item-stat bg-white rounded-lg p-4 md:p-6" style={{
      padding: '32px 28px',
      borderRadius: '12px',
      backgroundColor: 'rgb(255, 255, 255)',
      boxShadow: 'rgba(94, 92, 154, 0.06) 0px 0px 40px 0px',
      position: 'relative',
    }}>
      <img className="badge-item-stat-image-preview absolute top-8 left-6" src="https://i.imgur.com/Hgpa3y6.png" alt="badge-bronze-s" />
      <img className="badge-item-stat-image block mx-auto" src="https://i.imgur.com/Q5a2IIT.png" alt="badge-bronze-b" />
      <p className="badge-item-stat-title mt-9 text-lg font-bold text-center" style={{
        marginTop: '36px',
        fontSize: '1.125rem',
        fontWeight: '700',
        textAlign: 'center',
      }}>Bronze User</p>
      <p className="badge-item-stat-text mt-4 text-gray-600 text-center">Created an account with Social Circle! 🙏🏽</p>
      <div className="progress-stat mt-6 md:max-w-204 mx-auto">
        <div id="badge-bronze" className="progress-stat-bar bg-blue-500 h-1 relative" style={{
          height: '4px',
          position: 'relative',
        }}>
          <canvas width="204" height="4" className="absolute top-0 left-0" style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
          }}></canvas>
          <canvas width="204" height="4" className="absolute top-0 left-0"></canvas>
        </div>
        <div className="bar-progress-wrap" style={{
          marginTop: '28px',
        }}>
          <p className="bar-progress-info bg-green-500 text-white py-1 px-2 rounded-full text-sm text-center" style={{
            position: 'relative',
          }}>unlocked!</p>
        </div>
      </div>
    </div>
    <div className="badge-item-stat bg-white rounded-lg p-4 md:p-6" style={{
      padding: '32px 28px',
      borderRadius: '12px',
      backgroundColor: 'rgb(255, 255, 255)',
      boxShadow: 'rgba(94, 92, 154, 0.06) 0px 0px 40px 0px',
      position: 'relative',
    }}>
      <img className="badge-item-stat-image-preview absolute top-8 left-6" src="https://i.imgur.com/sM3Oe1R.png" alt="badge-bronze-s" />
      <img className="badge-item-stat-image block mx-auto" src="https://i.imgur.com/utgso4o.png" alt="badge-bronze-b" />
      <p className="badge-item-stat-title mt-9 text-lg font-bold text-center" style={{
        marginTop: '36px',
        fontSize: '1.125rem',
        fontWeight: '700',
        textAlign: 'center',
      }}>Tidying Up</p>
      <p className="badge-item-stat-text mt-4 text-gray-600 text-center">Viewed your own profile and started making edits.</p>
      <div className="progress-stat mt-6 md:max-w-204 mx-auto">
        <div id="badge-bronze" className="progress-stat-bar bg-blue-500 h-1 relative" style={{
          height: '4px',
          position: 'relative',
        }}>
          <canvas width="204" height="4" className="absolute top-0 left-0" style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
          }}></canvas>
          <canvas width="204" height="4" className="absolute top-0 left-0"></canvas>
        </div>
        <div className="bar-progress-wrap" style={{
          marginTop: '28px',
        }}>
          <p className="bar-progress-info bg-green-500 text-white py-1 px-2 rounded-full text-sm text-center" style={{
            position: 'relative',
          }}>unlocked!</p>
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
  )
}

export default BadgesContent