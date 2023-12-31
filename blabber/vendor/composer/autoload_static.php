<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit9c1838b31cf7ad35be5aa306b4b1f234
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PHPMailer\\PHPMailer\\' => 20,
        ),
        'M' => 
        array (
            'MyApp\\' => 6,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PHPMailer\\PHPMailer\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',
        ),
        'MyApp\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit9c1838b31cf7ad35be5aa306b4b1f234::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit9c1838b31cf7ad35be5aa306b4b1f234::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit9c1838b31cf7ad35be5aa306b4b1f234::$classMap;

        }, null, ClassLoader::class);
    }
}
